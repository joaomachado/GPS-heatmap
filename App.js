import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, Dimensions } from 'react-native';
import { Constants, Location, Permissions, MapView, Components } from 'expo';

let ScreenHeight = Dimensions.get("window").height;

export default class App extends Component {
  state = {
    locationResult: null,
    heatMapLayer: 'cycling',
    mapRegion: { latitude: 39.373519, longitude: -8.1465632, latitudeDelta: 0.1922, longitudeDelta: 5.8421 }
  };

  componentDidMount() {
    this._getLocationAsync();
  }
  
  _focusAtMyLocation = () => {
    this._getLocationAsync();
  };

  _handleMapRegionChange = (region) => {
    this.setState({ mapRegion: region });
  };
     
   _setRunMode = () => {
     this.setState({
       heatMapLayer: 'running',
     });
   };
   _setBikeMode = () => {
     this.setState({
       heatMapLayer: 'cycling',
     });
   };

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       locationResult: 'Permission to access location was denied',
     });
   }
   let location = await Location.getCurrentPositionAsync({});
   location.coords.latitudeDelta = 0.008;
   this.setState({ mapRegion: location.coords });
 };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Button 
            style={styles.button}
            title="Locate my position"
            onPress={this._focusAtMyLocation}
          />
          {(this.state.heatMapLayer === 'cycling') && 
          <Button
            title="Run mode"
            onPress={this._setRunMode}
          />
          }
          {(this.state.heatMapLayer === 'running') && 
          <Button
            title="Bike mode"
            onPress={this._setBikeMode}
          />
          }
          
        </View>
        <MapView
          style={{ alignSelf: 'stretch', height: ScreenHeight - 50 }}
          region={this.state.mapRegion}
          initialRegion={this.state.mapRegion}
          provider={'google'}
          mapType={'hybrid'}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          showsUserLocation={true}
          onRegionChange={this._handleMapRegionChange}
        >
          {(this.state.heatMapLayer === 'running') && 
          <MapView.UrlTile
            urlTemplate={'https://globalheat.strava.com/tiles/running/color5/{z}/{x}/{y}.png'}
             zIndex={-1}
          />
          }
           {(this.state.heatMapLayer === 'cycling') && 
          <MapView.UrlTile
            urlTemplate={'https://globalheat.strava.com/tiles/cycling/color5/{z}/{x}/{y}.png'}
             zIndex={-1}
          />
          }
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
  },
  buttons: {
    flexDirection: 'row',
    paddingTop: 10,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  }
});

