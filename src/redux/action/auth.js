import axios from 'axios';
import {showMessage} from '../../utils';
import {setLoading} from './global';

const API_HOST = {
  url: 'http://192.168.0.4/api',
};

export const signUpAction =
  (dataRegister, photoReducer, navigation) => dispatch => {
    axios
      .post(`${API_HOST.url}/register`, dataRegister)
      .then(res => {
        console.log('data success ', res.data);
        if (photoReducer.isUploadPhoto) {
          const photoForUpload = new FormData();
          photoForUpload.append('file', photoReducer);
          axios
            .post(`${API_HOST.url}/user/photo`, photoForUpload, {
              headers: {
                Authorization: `${res.data.data.token_type} ${res.data.data.access_token}`,
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(resUpload => {
              console.log('Success Upload: ', resUpload);
            })
            .catch(err => {
              showMessage('Upload photo tidak berhasil', err);
            });
        }
        dispatch(setLoading(false));
        showMessage('Register Success', 'success');
        navigation.replace('SuccessSignUp');
      })
      .catch(err => {
        dispatch(setLoading(false));
        showMessage(err?.response?.data?.data?.message);
      });
  };
