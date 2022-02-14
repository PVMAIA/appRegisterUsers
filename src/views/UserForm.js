import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Button,
  Alert,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Avatar, Icon} from 'react-native-elements';
import moment from 'moment';

const UserForm = ({route, navigation}) => {
  const [user, setUser] = useState(route.params ?? {});
  const [dateOfBirth, setDateOfBirth] = useState(
    route.params
      ? formatDate(route.params.dateofbirth, 'MM/DD/YYYY', 'DD/MM/YYYY')
      : null,
  );
  const [newPhoto, setNewPhoto] = useState(null);
  const [show, setShow] = useState(false);

  function formatDate(dateString, currentDateFormat, FormattedDateFormat) {
    return moment(dateString, currentDateFormat).format(FormattedDateFormat);
  }

  function handleChangeDateOfBirth(event, selectedDate) {
    const selectedDateFormated = selectedDate
      ? formatDate(selectedDate, 'YYYY/MM/DD', 'MM/DD/YYYY')
      : null;
    const dateOfBirthPtBr =
      selectedDateFormated &&
      formatDate(selectedDateFormated, 'MM/DD/YYYY', 'DD/MM/YYYY');
    const currentDate = dateOfBirthPtBr || dateOfBirth;
    setShow(false);
    setDateOfBirth(currentDate);
    setUser({...user, dateofbirth: currentDate});
  }

  async function handleRegisterOrUpdateUser() {
    const formData = new FormData();

    formData.append('name', user.name);
    formData.append('code', user.code);
    formData.append('dateOfBirth', user.dateofbirth);

    if (newPhoto) {
      formData.append('image', newPhoto);
    }

    if (user.id) {
      fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(response => {
          navigation.goBack();
        })
        .catch(err => {
          console.log({err});
        });

      return;
    }

    fetch('http://localhost:3000/users', {
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  }

  function handleLaunchCamera() {
    let options = {
      noData: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        return;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setNewPhoto({
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          uri: response.assets[0].uri,
        });
      }
    });
  }

  function handleLaunchImageLibrary() {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setNewPhoto({
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          uri: response.assets[0].uri,
        });
      }
    });
  }

  function handleNewPhotoUser() {
    Alert.alert('Foto', 'Escolha opção para enviar foto', [
      {
        text: 'Cancelar',
      },
      {
        text: 'Galeria',
        onPress() {
          handleLaunchImageLibrary();
        },
      },
      {
        text: 'Câmera',
        onPress() {
          handleLaunchCamera();
        },
      },
    ]);
  }

  function validateUri() {
    if (newPhoto) {
      return {uri: newPhoto.uri};
    }

    if (user.photo) {
      return {uri: user.photo};
    }

    return {};
  }

  return (
    <View style={style.form}>
      <View style={style.containerAvatar}>
        <Avatar
          size={150}
          rounded
          containerStyle={style.avatar}
          source={validateUri()}
          onPress={() => {
            handleNewPhotoUser();
          }}>
          <Avatar.Accessory onPress={() => handleNewPhotoUser()} size={40} />
        </Avatar>
      </View>

      <Text style={style.text}>Nome</Text>
      <TextInput
        onChangeText={name => setUser({...user, name})}
        placeholder="Digite o nome do usuário"
        value={user.name}
        style={style.input}
      />
      <Text style={style.text}>Código</Text>
      <TextInput
        onChangeText={code => setUser({...user, code})}
        placeholder="Digite o código do usuário"
        value={user.code}
        style={style.input}
      />
      <Text style={style.text}>Data de nascimento</Text>
      {show && (
        <DateTimePicker
          value={new Date(dateOfBirth)}
          minimumDate={new Date(1950, 0, 1)}
          display="default"
          mode="date"
          maximumDate={new Date()}
          onChange={handleChangeDateOfBirth}
          format={'YYYY/MM/DD'}
          displayFormat={'MM/DD/YYYY'}
        />
      )}
      <Pressable style={style.buttonDate} onPress={() => setShow(true)}>
        <Text>{dateOfBirth || ''}</Text>
        <Icon name="calendar-today" size={22} />
      </Pressable>
      <Button
        title="Salvar"
        onPress={() => {
          handleRegisterOrUpdateUser();
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  form: {
    padding: 12,
  },
  containerAvatar: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatar: {
    backgroundColor: 'gray',
  },
  text: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 6,
    padding: 8,
  },
  buttonDate: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 6,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default UserForm;
