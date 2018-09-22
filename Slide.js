import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image} from 'react-native';
import {IMAGES} from'./images';

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
type Props = {
  cardsLeft: number,
  destination: string,
  imagePath: string,
  swipingLeft: boolean,
  swipingRight: boolean,
}
export class Slide extends React.Component<Props> {
  render() {
    const { destination, imagePath, swipingLeft, swipingRight, cardsLeft } = this.props;
    console.log(`rendering Slide (cardsLeft: ${cardsLeft})`);
    return (
      <View style={styles.slide}>        
        <Image
          style={styles.imageSlide}
          source={IMAGES[destination]}
        />
        <Text style={styles.label}>
          {capitalize(destination)}
        </Text>
        {cardsLeft > 0 && <View style={[styles.stacked, styles.stacked1]} />}
        {cardsLeft > 1 && <View style={[styles.stacked, styles.stacked2]} />}
        {cardsLeft > 2 && <View style={[styles.stacked, styles.stacked3]} />}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  imageSlide: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: 340,
    height: 450,
  },
  label: {
    backgroundColor: '#fff',
    fontSize: 21,
    color: '#4a4a4a',    
    width: 340,
    borderColor: '#dedede',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
    zIndex: 100,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
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
  stacked: {
    backgroundColor: '#fff',
    borderColor: '#dedede',
    marginTop: -5,
    height: 10,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  stacked1: {
    width: '98%',
    zIndex: 80,
  },
  stacked2: {
    width: '95%',
    zIndex: 60,
  },
  stacked3: {
    width: '90%',
    zIndex: 40,
  },
});
