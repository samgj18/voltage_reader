import AsyncStorage from '@react-native-community/async-storage'

export const sendDataToServer = async (token, data) => {
  try {
    let config = {
      method: 'POST',
      headers: {
        'Authorization': 'Token' + ' ' + token,
        'Content-Type': 'application/json',
      },
      body: data
    }
    const URL = 'http://72.14.177.247/voltages/test-data/'
    const response = await fetch(URL, config)
    const serverResponse = await response.json()
    console.log(serverResponse)
  } catch (error) {
    console.log(error)
  }
}


const configureInfoFromData = (data) => {
  const headers = Object.keys(data[0])
  const voltageCoilOne = []
  const voltageCoilTwo = []

  for (const row of data) {
    const values = headers.map(header => {
      return row[header]
    })
    voltageCoilOne.push(values[0])
    voltageCoilTwo.push(values[1])
  }
  return [
    voltageCoilOne,
    voltageCoilTwo,
  ]
}

export const fetchDataFromServer = async (token, url) => {
  try {
    let config = {
      method: 'GET',
      headers: {
        'Authorization': 'Token' + ' ' + token,
        'Content-Type': 'application/json',
      },
    }
    const URL = url
    const response = await fetch(URL, config)
    const serverResponse = await response.json()
    const data = serverResponse.map(row => ({
      voltageCoilOne: row.voltage_coil_1,
      voltageCoilTwo: row.voltage_coil_2
    }))
    const dataSeparated = configureInfoFromData(data)
    return [
      dataSeparated[0],
      dataSeparated[1]
    ]
  } catch (error) {
  }
}



export const removeItemValue = async () => {
  try {
    await AsyncStorage.removeItem('databaseTest');
  }
  catch (exception) {
    console.log('Unable to erase data')
  }
}