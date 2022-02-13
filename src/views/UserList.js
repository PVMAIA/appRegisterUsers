import React, {useEffect, useState} from 'react';
import {View, FlatList, Alert} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import UserItem from '../components/UserItem';
import api from '../services/api';

const UserList = ({navigation}) => {
  const [users, setUsers] = useState([]);

  async function getusers() {
    const {data} = await api.get('/users');
    setUsers(data);
  }

  function handleDeleteUser(userId) {
    Alert.alert('Excluir Usuário', 'Deseja realmente excluir o usuário', [
      {
        text: 'Sim',
        async onPress() {
          await api.delete(`/users/${userId}`).then(() => {
            getusers();
          });
        },
      },
      {
        text: 'Não',
      },
    ]);
  }

  useEffect(() => {
    getusers()
      .then(() => {
        SplashScreen.hide();
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getusers();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      <FlatList
        keyExtractor={user => user.id}
        data={users}
        renderItem={({item}) => (
          <UserItem
            item={item}
            navigation={navigation}
            handleDeleteUser={handleDeleteUser}
          />
        )}
      />
    </View>
  );
};

export default UserList;
