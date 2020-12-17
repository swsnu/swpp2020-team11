#include <aws/core/utils/Array.h>
#include <aws/lambda-runtime/runtime.h>
#include <aws/core/utils/json/JsonSerializer.h>
#include <aws/core/utils/memory/stl/SimpleStringStream.h>
#include <vector>
#include <queue>
#include <string>
#include <math.h>
#include <cmath>

#define earthRadiusKm 6371.0
#define velocity 30
#define candiate_count 6

using namespace aws::lambda_runtime;
using namespace Aws::Utils::Json;
using namespace Aws::Utils;
using namespace std;

class Place {
public:
    int id;
    double preference;
    double lng;
    double lat;

    Place() : id(0), preference(0), lng(0), lat(0) {};

    Place(JsonView view) {
      id = view.GetInteger("id");
      preference = view.GetDouble("preference");
      lng = view.GetDouble("lng");
      lat = view.GetDouble("lat");
    };

    Aws::String json_dump() {
      Aws::SimpleStringStream ss;
      ss << "{\"id\": " << id << "}";
      return ss.str();
    };
};

vector <Place> Location(Array <JsonView> arr) {
  vector <Place> places;
  for (size_t i = 0; i < arr.GetLength(); ++i) {
    Place place = Place(arr[i]);
    places.push_back(place);
  }
  return places;
}

class Plan {
public:
    double distance;
    double travel_period;
    double satisfaction;
    Place* activity;
    Place* dinner;
    Place* scenery;

    Plan(double dist, double per, double sat, Place* act, Place* din, Place* sce)
            : distance(dist), travel_period(per), satisfaction(sat), activity(act), dinner(din), scenery(sce) {};

    Aws::String json_dump() {
      Aws::SimpleStringStream ss;

      ss << "{\"distance\": " << distance << ", \"travel_period\": " << travel_period \
 << ", \"satisfaction\": " << satisfaction << ", \"activity\": " << activity -> json_dump() \
 << ", \"dinner\": " << dinner -> json_dump() << ", \"scenery\": " << scenery -> json_dump() << "}";

      return ss.str();
    };
};

struct cmp {
    bool operator()(Plan& t, Plan& u) {
      return t.satisfaction < u.satisfaction;
    };
};

// This function converts decimal degrees to radians
double deg2rad(double deg) {
  return (deg * M_PI / 180);
}

//  This function converts radians to decimal degrees
double rad2deg(double rad) {
  return (rad * 180 / M_PI);
}


double manhattan_distanceEarth(double lat1d, double lng1d, double lat2d, double lng2d) {
  double u, v;
  double lat1r = deg2rad(lat1d);
  double lng1r = deg2rad(lng1d);
  double lat2r = deg2rad(lat2d);
  double lng2r = deg2rad(lng2d);
  u = sin(fabs(lat2r - lat1r) / 2);
  v = sin(fabs(lng2r - lng1r) / 2);
  return 2.0 * earthRadiusKm * (asin(u) + asin(v * sqrt(cos(lat1r) * cos(lat2r))));
}

void calculate_distances(vector <Place>& places1, vector <Place>& places2, vector <vector<double>>& distance) {
  int i_count = static_cast<int>(places1.size());
  for (int i = 0; i < i_count; ++i) {
    double lat1 = places1[i].lat;
    double lng1 = places1[i].lng;
    int j_count = static_cast<int>(places2.size());
    for (int j = 0; j < j_count; ++j) {
      double lat2 = places2[j].lat;
      double lng2 = places2[j].lng;
      distance[i][j] = manhattan_distanceEarth(lat1, lng1, lat2, lng2);
    }
  }
}


static invocation_response my_handler(invocation_request const& req) {
  priority_queue <Plan, vector<Plan>, cmp> plan_min_heap;


  JsonValue json(req.payload);
  if (!json.WasParseSuccessful()) {
    return invocation_response::failure("Failed to parse input JSON", "InvalidJSON");
  }

  auto v = json.View();

  // parsing data from request
  auto current_location = v.GetObject("current_location");
  vector <Place> current;
  current.push_back({current_location});
  auto time_limit = v.GetDouble("time_limit");

  auto activity = Location(v.GetArray("activity"));

  int activity_count = sizeof(activity) / sizeof(activity[0]);

  auto dinner = Location(v.GetArray("dinner"));
  int dinner_count = sizeof(dinner) / sizeof(dinner[0]);

  auto scenery = Location(v.GetArray("scenery"));
  int scenery_count = sizeof(scenery) / sizeof(scenery[0]);

  // create vector to store distance between places
  vector <vector<double>> home2activity_distance(1, vector<double>(activity_count));
  vector <vector<double>> activity2dinner_distance(activity_count, vector<double>(dinner_count));
  vector <vector<double>> dinner2scenery_distance(dinner_count, vector<double>(scenery_count));
  vector <vector<double>> scenary2home_distance(scenery_count, vector<double>(1));

  // calculate and save to vector distance between places
  calculate_distances(current, activity, home2activity_distance);
  calculate_distances(activity, dinner, activity2dinner_distance);
  calculate_distances(dinner, scenery, dinner2scenery_distance);
  calculate_distances(scenery, current, scenary2home_distance);

  // compare pathes
  for (int i = 0; i < activity_count; ++i) {
    for (int j = 0; j < dinner_count; ++j) {
      for (int k = 0; k < scenery_count; ++k) {
        double distance = home2activity_distance[0][i] + \
                          activity2dinner_distance[i][j] + \
                          dinner2scenery_distance[j][k] + \
                          scenary2home_distance[k][0];

        if (distance / velocity > time_limit) continue;

        double satisfaction = activity[i].preference + \
                              dinner[j].preference + \
                              scenery[k].preference;

        if (plan_min_heap.top().satisfaction > satisfaction) continue;
        if (plan_min_heap.size() >= candiate_count) plan_min_heap.pop();

        Plan plan = Plan(satisfaction, distance / velocity, distance, &activity[i], &dinner[j], &scenery[k]);

        plan_min_heap.push(plan);
      }
    }
  }
  int i = candiate_count - 1;
  Array<Aws::String> result(candiate_count);
  while (!plan_min_heap.empty()) {
    Plan plan = plan_min_heap.top();
    result[i] = plan.json_dump();
    plan_min_heap.pop();
    i -= 1;
  }

  // json dump
  JsonValue resp;
  resp.WithArray("result", result);

  return invocation_response::success(resp.View().WriteCompact(), "application/json");
}

int main() {
  run_handler(my_handler);
  return 0;
}