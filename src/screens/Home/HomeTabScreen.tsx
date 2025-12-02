import React from 'react';
import { View, StyleSheet } from 'react-native';
import { InstagramSection } from '../../components/home/InstagramSection';

export default function ContentFeed() {
  return (
    <View style={styles.container}>
       <InstagramSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});