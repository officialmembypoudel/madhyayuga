import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.cancelled) {
    await uploadImage(result.uri);
  }
  
};
const uploadImage = async (uri) => {
    const buffer = await fetch(uri).then((res) => res.arrayBuffer());
    const file = new File([buffer], 'image.jpg', { type: 'image/jpeg' });
  
    const response = await client.storage.createFile(file);
  
    console.log(response);
  };
  