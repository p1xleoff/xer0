import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import moment from 'moment';

const Events = () => {
  const [events, setEvents] = useState([]);
  const database = getDatabase();

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const eventData = Object.values(snapshot.val());
        // console.log(eventData);
        setEvents(eventData);
      } else {
        setEvents([]);
      }
    });
  }, []);

  const calculateRemainingTime = (item) => {
    const currentTime = moment();
    const eventStartTime = moment()
      .startOf('day')
      .set({
        hour: parseInt(item.startTime.split(':')[0]),
        minute: parseInt(item.startTime.split(':')[1]),
      });

    if (item.name === 'CWL') {
      // Calculate the start time of the current month's Clan War Leagues phases
      const eventStartTime = moment()
        .startOf('month')
        .set({ hour: 13, minute: 30 });
      const signUpEndTime = moment(eventStartTime).add(2, 'days');
      const leagueEndTime = moment(signUpEndTime).add(8, 'days');

      if (currentTime.isBefore(eventStartTime)) {
        // Before the event starts
        const timeDiff = eventStartTime.diff(currentTime, 'milliseconds');
        const remainingTime = moment.duration(timeDiff);
        const days = remainingTime.days();
        const hours = remainingTime.hours();
        const minutes = remainingTime.minutes();
        if (days === 0) {
          return `${hours}h ${minutes}m`;
        } else {
          return `${days}d ${hours}h ${minutes}m`;
        }
      } else if (currentTime.isBefore(signUpEndTime)) {
        // During the sign-up period
        const timeDiff = signUpEndTime.diff(currentTime, 'milliseconds');
        const remainingTime = moment.duration(timeDiff);
        const days = remainingTime.days();
        const hours = remainingTime.hours();
        const minutes = remainingTime.minutes();
        if (days === 0) {
          return `(SignUp)${hours}h ${minutes}m`;
        } else {
          return `(SignUp)${days}d ${hours}h ${minutes}m`;
        }
      } else if (currentTime.isBefore(leagueEndTime)) {
        // During the league duration
        const timeDiff = leagueEndTime.diff(currentTime, 'milliseconds');
        const remainingTime = moment.duration(timeDiff);
        const days = remainingTime.days();
        const hours = remainingTime.hours();
        const minutes = remainingTime.minutes();
        if (days === 0) {
          return `(Active)${hours}h ${minutes}m`;
        } else {
          return `(Active)${days}d ${hours}h ${minutes}m`;
        }
      } else {
        // Calculate the start time of the next month's CWL
        const nextMonthStartTime = moment()
          .add(1, 'month')
          .startOf('month')
          .set({ hour: 13, minute: 30 });
        const timeDiff = nextMonthStartTime.diff(currentTime, 'milliseconds');
        const remainingTime = moment.duration(timeDiff);
        const days = remainingTime.days();
        const hours = remainingTime.hours();
        const minutes = remainingTime.minutes();
        if (days === 0) {
          return `${hours}h ${minutes}m`;
        } else {
          return `${days}d ${hours}h ${minutes}m`;
        }
      }
    }

    if (item.name === 'League Reset') {
      const currentMonth = currentTime.month();
      const lastMondayOfCurrentMonth = moment()
        .startOf('month')
        .month(currentMonth)
        .endOf('month')
        .day('Monday')
        .hour(10)
        .minute(30);
      const nextMonth = (currentMonth + 1) % 12;
      const lastMondayOfNextMonth = moment()
        .startOf('month')
        .month(nextMonth)
        .endOf('month')
        .day('Monday')
        .hour(10)
        .minute(30);

      // If today is after the last Monday of the current month, move to the last Monday of next month
      if (currentTime.isAfter(lastMondayOfCurrentMonth)) {
        const timeDiff = lastMondayOfNextMonth.diff(
          currentTime,
          'milliseconds'
        );
        const remainingTime = moment.duration(timeDiff);
        return `${remainingTime.days()}d ${remainingTime.hours()}h ${remainingTime.minutes()}m`;
      } else {
        const timeDiff = lastMondayOfCurrentMonth.diff(
          currentTime,
          'milliseconds'
        );
        const remainingTime = moment.duration(timeDiff);
        return `${remainingTime.days()}d ${remainingTime.hours()}h ${remainingTime.minutes()}m`;
      }
    }

    if (item.name === 'Raid Weekend') {
      // Raid Weekend logic
      const fridayStartTime = moment()
        .startOf('day')
        .day('Friday')
        .hour(12)
        .minute(30);
      const mondayEndTime = moment()
        .startOf('day')
        .day('Monday')
        .hour(12)
        .minute(30)
        .add(1, 'week'); // End of Monday of current week
      if (currentTime.isBetween(fridayStartTime, mondayEndTime, null, '[]')) {
        // Raid Weekend is active
        const timeDiff = mondayEndTime.diff(currentTime, 'milliseconds');
        const remainingTime = moment.duration(timeDiff);
        const days = remainingTime.days();
        const hours = remainingTime.hours();
        const minutes = remainingTime.minutes();
        if (days === 0) {
          return `(Active)${hours}h ${minutes}m`;
        } else {
          return `(Active)${days}d ${hours}h ${minutes}m`;
        }
      } else {
        // Raid Weekend is not active
        const timeDiff = currentTime.isBefore(fridayStartTime)
          ? fridayStartTime.diff(currentTime, 'milliseconds')
          : moment()
              .day('Friday')
              .add(1, 'week')
              .hour(12)
              .minute(30)
              .diff(currentTime, 'milliseconds');
        const remainingTime = moment.duration(timeDiff);
        const days = remainingTime.days();
        const hours = remainingTime.hours();
        const minutes = remainingTime.minutes();
        if (days === 0) {
          return `${hours}h ${minutes}m`;
        } else {
          return `${days}d ${hours}h ${minutes}m`;
        }
      }
    }

    if (item.name === 'Clan Games') {
      const startOfMonth = moment()
        .startOf('month')
        .date(22)
        .hour(13)
        .minute(30);
      const endOfMonth = moment().endOf('month').hour(13).minute(29).second(59);
      const currentTime = moment();

      if (currentTime.isBetween(startOfMonth, endOfMonth)) {
        // Clan Games is active
        const timeDiff = endOfMonth.diff(currentTime, 'milliseconds');
        const remainingTime = moment.duration(timeDiff);
        const days = remainingTime.days();
        const hours = remainingTime.hours();
        const minutes = remainingTime.minutes();
        if (days === 0) {
          return `(Active)${hours}h ${minutes}m`;
        } else {
          return `(Active)${days}d ${hours}h ${minutes}m`;
        }
      } else {
        // Clan Games is not active
        const timeDiff = currentTime.isBefore(startOfMonth)
          ? startOfMonth.diff(currentTime, 'milliseconds')
          : moment()
              .endOf('month')
              .add(1, 'day')
              .hour(13)
              .minute(30)
              .diff(currentTime, 'milliseconds');
        const remainingTime = moment.duration(timeDiff);
        const days = remainingTime.days();
        const hours = remainingTime.hours();
        const minutes = remainingTime.minutes();
        if (days === 0) {
          return `${hours}h ${minutes}m`;
        } else {
          return `${days}d ${hours}h ${minutes}m`;
        }
      }
    }

    if (item.repeat === 'weekly') {
      eventStartTime.day(item.dayOfWeek);
      if (eventStartTime.isBefore(currentTime)) {
        eventStartTime.add(7, 'days');
      }
    } else if (item.repeat === 'monthly') {
      const startDayOfMonth = parseInt(item.startDayOfMonth);
      let startOfMonth = moment()
        .startOf('month')
        .set({
          date: startDayOfMonth,
          hour: parseInt(item.startTime.split(':')[0]),
          minute: parseInt(item.startTime.split(':')[1]),
        });

      // If the current date has passed the event's start time for this month,
      // move to the next month
      if (currentTime.isAfter(startOfMonth)) {
        startOfMonth.add(1, 'month');
      }

      eventStartTime.set({
        year: startOfMonth.year(),
        month: startOfMonth.month(),
        date: startOfMonth.date(),
      });
    }

    const duration = parseInt(item.duration);
    const timeDiff = eventStartTime.diff(currentTime, 'milliseconds');
    const remainingTime = moment.duration(timeDiff);

    if (timeDiff <= 0) {
      return 'Event Active';
    } else {
      const days = remainingTime.days();
      const hours = remainingTime.hours();
      const minutes = remainingTime.minutes();
      if (days === 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${days}d ${hours}h ${minutes}m`;
      }
    }
  };

  const renderEvent = ({ item, index }) => {
    const remainingTime = calculateRemainingTime(item);
    const isActive = remainingTime.includes('Active');
    const isSignUp = remainingTime.includes('SignUp');

    return (
      <View style={styles.card} key={index}>
        <View style={styles.row}>
          <Text style={styles.text}>
            {item.name}
            {isActive && <Text style={styles.activeText}> (Active)</Text>}
            {isSignUp && <Text style={styles.activeText}> (Sign Up)</Text>}
          </Text>
        </View>
        <Text style={styles.text}>
          {isActive || isSignUp
            ? remainingTime.replace('(Active)', '').replace('(SignUp)', '')
            : remainingTime}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold' }]}>
          Recurring In-Game Events
        </Text>
        <View style={styles.recurringEvents}>
          {events.map((item, index) => (
            <View style={styles.column} key={index}>
              {renderEvent({ item })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#040404',
  },
  container: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  recurringEvents: {
    flexDirection: 'row',
    backgroundColor: '#090909',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
    borderRadius: 5,
  },
  column: {
    width: '48%',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#101010',
    elevation: 7,
    padding: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  activeText: {
    fontWeight: 'bold',
    color: 'green', // or any other color you prefer
  },
});

export default Events;
