import React from 'react';
import { Map, GoogleApiWrapper,Marker, InfoWindow } from 'google-maps-react';


class HistoryItem extends React.Component{
    
    render(){
        const seoul = {lat: this.props.lat, lng: this.props.lng}
        const seoul2 = {lat: this.props.lat+0.01, lng: this.props.lng}
        const seoul3 = {lat: this.props.lat+0.01, lng: this.props.lng+0.01}
        // var bounds = new this.props.google.maps.LatLngBounds();
        // bounds.extend({lat: seoul.lat-0.0000001, lng: seoul.lng-0.0000001});
        // bounds.extend({lat: seoul.lat+0.0000001, lng: seoul.lng-0.0000001});
        // bounds.extend({lat: seoul.lat-0.0000001, lng: seoul.lng+0.0000001});
        // bounds.extend({lat: seoul.lat+0.0000001, lng: seoul.lng+0.0000001});
        return (
            <div className = "Seoul">
                <Map
                    google={this.props.google}
                    zoom={10}
                    initialCenter={seoul}
                    containerStyle={{width:'200px', height:'200px'}}
                    // bounds={bounds}
                    position = 'relative'
                >
                    <Marker position={seoul}></Marker>
                    <Marker position={seoul2}></Marker>
                    <Marker position={seoul3}></Marker>
                </Map>
            </div>
        );
    }
}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyD70sVDcsxs4GHb7PnaqaMwOHHwm-5BvWY'
  })(HistoryItem);