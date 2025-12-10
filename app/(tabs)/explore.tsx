import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';

const categories = [
  { id: '1', title: 'Courses', icon: 'book', color: '#3498db' },
  { id: '2', title: 'Events', icon: 'calendar', color: '#e74c3c' },
  { id: '3', title: 'Campus Map', icon: 'map-marker', color: '#2ecc71' },
  { id: '4', title: 'Facilities', icon: 'building', color: '#f39c12' },
  { id: '5', title: 'Clubs', icon: 'users', color: '#9b59b6' },
  { id: '6', title: 'Departments', icon: 'university', color: '#1abc9c' },
  { id: '7', title: 'Library', icon: 'book', color: '#34495e' },
  { id: '8', title: 'Support', icon: 'question-circle', color: '#e67e22' },
];

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Campus</Text>
        <Text style={styles.subtitle}>Discover everything your university has to offer</Text>
      </View>

      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
              <FontAwesome name={category.icon as any} size={32} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>{category.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <TouchableOpacity style={styles.listItem}>
          <FontAwesome name="clock-o" size={20} color="#666" />
          <Text style={styles.listItemText}>Class Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem}>
          <FontAwesome name="bell" size={20} color="#666" />
          <Text style={styles.listItemText}>Announcements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem}>
          <FontAwesome name="file-text" size={20} color="#666" />
          <Text style={styles.listItemText}>Academic Resources</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  card: {
    width: '47%',
    margin: '1.5%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  listItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
});
