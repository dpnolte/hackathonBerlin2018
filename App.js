/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image,TouchableOpacity, WebView, YellowBox, Animated } from 'react-native';
import base64 from 'base-64';
import Video from 'react-native-video';
import {
  PanGestureHandler,
  ScrollView,
  State,
} from 'react-native-gesture-handler';
import { Topbar } from './Topbar';
import { Slide } from './Slide';
import Swiper from './Swiper';
import { DESTINATIONS } from './destinations';
YellowBox.ignoreWarnings(['Require cycle:']);

const video = require('./assets/video/demo-destination-tinder.mp4');
const video2 = require('./assets/video/video2.mp4');

type Props = {};
type Destination = {
  name: string,
  selected: boolean,
  imagePath: string,
}
type StateType = {
  destinations: Array<Destination>,
  completed: boolean,
  swipingLeft: boolean,
  swipingRight: boolean,
  destinationUrl: string,

}
const endPointStart = "https://ibe.traffics.de/pauschalreise/hotels?searchDate=0,365&adults=2"
const endPointForIntermediateUpdate = "https://connector.traffics.de/v3/rest/hotels?searchDate=0,365&adults=2&productType=pauschal"
export default class App extends Component<Props, StateType> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentDestination: 0,
      swipingRight: false,
      swipingLeft: false,
      completed: false,
      videoShown: false,
      destinations: DESTINATIONS,
      destinationUrl: endPointStart,
      offerCount: 0,
      animatedBackground: new Animated.Value(0),
      opacity: 0,
    }
  }
  reset() {
    const destinations = DESTINATIONS
    destinations.forEach(d => {
      d.processed = false;
      d.selected = false;
    });
    this.setState({
      completed: false,
      videoShown: false,
      currentDestination: 0,
      offerCount: 0,
      destinations: destinations
    });
  }
  componentDidUpdate(prevProps: Props) {
    if (this.props.completed == true && this.props.completed === false) {
      this.swiper.jumpToIndex(0);
    }
  }
  getSlides() {    
    const slides = []
    let cardsLeft = this.state.destinations.length;
    this.state.destinations.forEach(destination => {
      if (destination.processed === false) {
      slides.push(<Slide 
          key={destination.name}
          cardsLeft={cardsLeft}
          swipingLeft={this.state.swipingLeft}
          swipingRight={this.state.swipingRight}
          destination={destination.name}
          imagePath={destination.imagePath}
        />);
        cardsLeft -= 1;
      }
    });
    return slides;
  }
  onSwipeRight() {    
    this.setState({swipingLeft: false, swipingRight: true});
  }
  onSwipeLeft() {
    this.setState({swipingLeft: true, swipingRight: false});
  }
  onSelection() {
    const {
      swipingRight,
      currentDestination,
      destinations,
    } = this.state;
    if (currentDestination < destinations.length) {
      this.animateBackground();
      const nextDestination = currentDestination + 1
      const completed = currentDestination == destinations.length - 1;
      const selected = swipingRight === true;
      destinations[currentDestination].selected = selected;
      const destinationUrl = completed === true ? this.getWebViewUrl() : endPointStart;
      if (!selected) {
        this.swiper.jumpToIndex(nextDestination);
      }
      this.getIntermediateResults();
      this.setState({
        currentDestination: nextDestination,
        destinations,
        completed,
        destinationUrl,
      });
    } 
  }
  
  getWebViewUrl() {
    const { swipingLeft, swipingRight, destinations, completed } = this.state;
    const endPoint = endPointStart + this.getParams();
    console.log('send selection to: ' + endPoint);
    return endPoint;
  }
  getIntermediateResults() {
    const { swipingLeft, swipingRight, destinations, completed } = this.state;
    const endPoint = endPointForIntermediateUpdate + this.getParams();
    const username = 'tfx_hackathon_003';
    const password = 'Amat91Uwile2';
    const headers = new Headers();
    //headers.append('Content-Type', 'text/json');
    headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
    console.log(headers);
    console.log('sending request to');
    console.log(endPoint);
    fetch(endPoint, {method:'GET',
            headers: headers,
          })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({ offerCount: json.totalResultCount })
      })
      .done();
    return endPoint;
  }

  getParams() {
    const { swipingLeft, swipingRight, destinations, completed } = this.state;
    const params = destinations.reduce((obj, next) => {
        if (next.selected === true) {
          if (obj[next.key]) {
            obj[next.key] += "," + next.value
          } else {
            obj[next.key] = next.value
          }
        }
        return obj;
    }, {});
    let result = "";
    Object.keys(params).forEach(key => {
      result += `&${key}=${params[key]}`
    });
    return result
  }  

  onSwiped() {
    this.setState({swipingLeft: false, swipingRight: false});
  }
  getWebView() {
    const source = {
      uri: this.state.destinationUrl
    };
    return (
      <WebView
        source={source}
        style={{width: 400, height: 600}}
      />
    );
  }
  animateBackground() {
    Animated.sequence([
      Animated.timing(this.state.animatedBackground, {
        toValue: 1,
        duration: 200,
      }),
      Animated.timing(this.state.animatedBackground, {
        toValue: 0,
        duration: 200,
      }),
    ]).start();
  }

  getVideoSource() {
    const { destinations } = this.state;
    const berlinAsDestination = destinations.find(d => d.name === 'berlin');
    if (berlinAsDestination && berlinAsDestination.selected === true) {
      return video2;
    } else {
      return video;
    }
  }

  render() {
    const { swipingLeft, swipingRight, destinations, completed, destinationUrl, offerCount, animatedBackground, videoShown } = this.state;
    console.log("rendering App");
    console.log(this.state);
    const animatedBackgroundStyle = {
      opacity: animatedBackground,
    };
    //console.log(animatedBackgroundStyle);
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.animatedBackground, animatedBackgroundStyle]} />
        {completed === false || videoShown && (<Topbar
          completed={completed}
          onPress={() => this.reset()}
        />)}
        {completed === false && (
          <View style={styles.swiperContainer}>
            <Swiper
              ref={s => { this.swiper = s; }}
              style={styles.swiper}
              smoothTransition
              loop={false}
              showPagination={false}
              onSwipingRight={() => {
                console.log('right');
                this.onSwipeRight();
              }}
              onSwipingLeft={() =>  {
                console.log('left');
                this.onSwipeLeft();
              }}
              onSwiped={() => {
                this.onSwiped();
              }}
              onRemoveCard={() => this.onSelection()}
            >
            {this.getSlides()}
          </Swiper>
          {swipingRight === true && (<Text style={[styles.badge, styles.like]}>LIKE</Text>)}
          {swipingLeft === true && (<Text style={[styles.badge, styles.nope]}>NOPE</Text>)}
          {offerCount > 0 && (<Text style={styles.personalizedOffers}>Personalized Offers: {offerCount}</Text>)}
        </View>)}
        {completed === true && videoShown === false && (
          <Video 
            style={styles.video}
            source={this.getVideoSource()}
            onBuffer={() => {}}                // Callback when remote video is buffering        
            onError={() => console.log('video error')} 
            onEnd={() => {
              this.setState({videoShown: true});
            }}
          />)}
        {videoShown === true && this.getWebView()}
      </View>
    );
  }
}
/*
<View style={styles.completed}>
            <Text style={styles.woopWoop}>Woop, woop! </Text>
            <Text style={styles.completedTitle}>Completed</Text>
            <TouchableOpacity style={styles.again}>
              <Text>Again?</Text>
            </TouchableOpacity>
          </View>*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',    
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#f0ed90',
  },
  swiper: {
    marginTop: 12,
  },
  swiperContainer: {
    zIndex: 20,
  },
  badge: {
    position: 'absolute',
    fontSize: 60,
    borderRadius: 20,
    borderWidth: 5,
    paddingLeft: 20, 
    paddingRight: 20,
  },
  like: {
    top: 50,
    left: 150,
    color: '#3bc856',
    borderColor: '#3bc856',
    transform: [{ rotate: '45deg'}]
  },
  nope: {
    top: 60,
    left: 0,
    color: '#d95228',
    borderColor: '#d95228',
    transform: [{ rotate: '315deg'}]
  },
  completed: {
    height: '100%',
    width: '100%',
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center'
  },
  woopWoop: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  again: {
    fontSize: 18,
    
  },
  personalizedOffers: {
    fontSize: 18,
    height: 50,
    width: '100%',
    position: 'absolute',
    top: 570,
    textAlign: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 200,
  },
});
