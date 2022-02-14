import moment from 'moment';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Avatar, Button, ListItem} from 'react-native-elements';

const UserItem = ({item: user, navigation, handleDeleteUser}) => {
  return (
    <ListItem.Swipeable
      rightContent={
        <Button
          title="Excluir"
          icon={{name: 'delete', color: 'white'}}
          buttonStyle={style.buttonDelete}
          onPress={() => {
            handleDeleteUser(user.id);
          }}
        />
      }
      key={user.id}
      bottomDivider
      onPress={() => navigation.navigate('UserForm', user)}>
      <Avatar rounded source={{uri: user.photo}} />
      <ListItem.Content>
        <ListItem.Title style={style.title}>{user.name}</ListItem.Title>
        <ListItem.Subtitle>
          Data de nascimento:{' '}
          {moment(user.dateofbirth, 'MM/DD/YYYY').format('DD/MM/YYYY')}
        </ListItem.Subtitle>
        <ListItem.Subtitle>Código: {user.code}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron size={26} />
    </ListItem.Swipeable>
  );
};

const style = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
  buttonDelete: {
    minHeight: '100%',
    backgroundColor: 'red',
  },
});

export default UserItem;
