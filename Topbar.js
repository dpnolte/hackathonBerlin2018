import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

export class Topbar extends React.Component {

  render() {
    const { completed, onPress } = this.props;
    return (
    <View style={[styles.container, { height: completed === true ? 40 : 80 }]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.title, { marginTop: completed === true ? 5 : 45 }]}>destination tinder</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
    </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F5FCFF',
  },
  title: {
    color: '#de7353',
    fontSize: 24,
    marginLeft: 20,
    marginBottom: 2,
  },
  divider: {
    height: 4,
    width: '100%',
    backgroundColor: '#f0f0f0',
  }
});
