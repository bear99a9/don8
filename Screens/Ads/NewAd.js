import React, { useEffect, useState, useContext } from "react";
import { View, TextInput, Text, StyleSheet, Button, TouchableOpacity, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import axios from 'axios'
import Toast from "react-native-toast-message"
import AsyncStorage from "@react-native-community/async-storage";
import AuthGlobal from "../../Context/store/AuthGlobal";
import * as ImagePicker from "expo-image-picker"
import mime from "mime"

import Error from "../../Shared/Error";
import baseURL from '../../assets/common/baseUrl'


const NewAd = (props) => {
  const context = useContext(AuthGlobal);

  const [token, setToken] = useState("")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [contact, setContact] = useState("")
  const [charity, setCharity] = useState(context.stateUser.user.userId)
  const [image, setImage] = useState()
  const [mainImage, setMainImage] = useState()
  const [website, setWebsite] = useState("")
  const [userProfile, setUserProfile] = useState();

  const [error, setError] = useState();

  useEffect(() => {
    async function updateUser() {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate("Login");
      }

      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res)
          axios
            .get(`${baseURL}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((user) => setUserProfile(user.data));
        })
        .catch((error) => console.log(error));
      }
    updateUser();

    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestCamteraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work")
        }
      }
    })

  }, [])

  const handleSubmit = () => {

    console.log("Image is", mime.getType(image))

    let formData = new FormData()

    const newImageUri = "file:///" + image.split("file:/").join("");

    formData.append("title", title)
    formData.append("location", location)
    formData.append("description", description)
    formData.append("charity", charity)
    formData.append("contact", contact)
    formData.append("website", website)
    formData.append("image", image)
    // {
    //   uri: newImageUri,
    //   type: mime.getType(newImageUri),
    //   name: newImageUri.split('/').pop()
    // })

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }

    // const ad = {
    //   title,
    //   location,
    //   description,
    //   contact,
    //   charity,
    //   website,
    //   {image: {uri: image, type: mime.getType(image), name: image.split("/").pop()}}
    // };

    if (![title, location, description, contact, charity, website].every((field) => {return field !== ""})) {
      setError("Please fill in all details");
    } else {
      axios
        .post(`${baseURL}ads`, formData, config)
        .then((response) => {
          if (response.status === 201) {
            props.navigation.navigate("Home")
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Advert created!",
              text2: "",
            });
            console.log("Successfully created advert.");
          }
        })
        .catch(error => {
          if(!error.response){
            console.log("Server not running.")
          }
          else if (error.response.status === 401) {
            setError("You aren't authorized to make this advert")
          } else { setError("Unknown error") }
        })
    }

  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4,3],
      quality: 1
    })

    if(!result.cancelled) {
      setMainImage(result.uri)
      setImage(result.uri)
      console.log("Image picked", result.uri)
    }

  }

  return (
    <View style={styles.container}>


      <View>
        <Image source={{uri: mainImage}}/>
        <TouchableOpacity onPress={pickImage}>
          <Text>Add Image</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Title..."
          placeholderTextColor="white"
          onChangeText={(text) => setTitle(text)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          // placeholder={userProfile ? userProfile.address : "Location!"}
          placeholder="Location..."
          placeholderTextColor="white"
          onChangeText={(text) => setLocation(text)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Description..."
          placeholderTextColor="white"
          onChangeText={(text) => setDescription( text)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          // placeholder={userProfile ? userProfile.email : "Email..."}
          placeholder="Contact..."
          placeholderTextColor="white"
          onChangeText={(text) => setContact(text)} // Should be setEmail when that's integrated
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          // placeholder={userProfile ? userProfile.website : "Website..."}
          placeholder="Website..."
          placeholderTextColor="white"
          onChangeText={(text) => setWebsite(text)}
        />
      </View>

      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        <Button title="Submit" onPress={() => handleSubmit()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "gainsboro",
    alignItems: "center",
    justifyContent: "center",
  },
  inputView: {
    width: "80%",
    backgroundColor: "#003f5c",
    color: "black",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "white",
  },
});

export default NewAd;
