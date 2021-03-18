import React, { useState, useCallBack, useEffect } from 'react'
// import { useEffect } from "@react-navigation/native";
import { Button, StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import Form from './Form';
import axios from 'axios'

import Ad from './Ad'

// Import sampleAds
let samples = require('../assets/sampleAds.json');
// End import

const Home = () => {

    const [title, setTitle] = useState('Don8')
    const [text, setText] = useState()
    const [list, setList] = useState(samples)

    const [showAds, setShowAds] = useState(true)
    const [showForm, setShowForm] = useState(false)


    const toggleForm = () => {
      setShowAds(false)
      setShowForm(true)
    };

    // useFocusEffect(
    // useCallback(() => {

    // We need something to stop this happening constantly
    useEffect(() => {
      async function updateList() {
        axios
          .get('http://localhost:3000/api/v1/ads')
          .then((res) => {
            setList(res.data)
            console.log(res.data);
          })
          .catch((error) => {
            console.log(`Error message: ${error}`);
          })
        }

        updateList()
    }, []);


    //     return() => { console.log("Hello")}
    //   }, [])
    // )

    return(
       (showAds &&
        <View style={{ width: '80%', marginBottom: 60 }}>
          <Text style={[styles.align, styles.font]}> {title} </Text>
          <View>
            <Button title='Make a new request' onPress={toggleForm}/>
          </View>
          <ScrollView>
            {list.map((x, index) =>
              <Ad key={index} item={x} index={index}/>
            )}
          </ScrollView>
        </View>
      ) || (showForm && < Form />)
      //   ,
      //
      //
      //

    )
}

// Stylesheet for title and input box

const styles = StyleSheet.create({
    align: {
      alignSelf: 'center'
    },
    font: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    input: {
      borderRadius: 5,
      borderWidth: 1,
      marginBottom: 8,
      padding: 8
    }
})

export default Home;

// useFocusEffect(
//     useCallback(() => {
//       AsyncStorage.getItem("jwt").then((res) => {
//         axios
//           .get(`${baseURL}plants/${user}`, {
//             headers: { Authorization: `Bearer ${res}` },
//           })
//           .then((res) => {
//             setPlants(res.data);
//           })
//           .catch((error) => {
//             console.log(`Error message: ${error}`);
//           });
//       });
//
//       return () => {
//         setPlants([]);
//       };
//     }, [])
