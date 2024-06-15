import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Modal, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVietnamese, setIsVietnamese] = useState(true);
  const countRef = useRef(null);

  // Tốc độ đếm thời gian, giá trị nhỏ hơn để tăng tốc độ
  const interval = 500; // 500ms = 0.5 giây

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, interval);
  };

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsPaused(true);
  };

  const handleContinue = () => {
    setIsPaused(false);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, interval);
  };

  const handleReset = () => {
    clearInterval(countRef.current);
    setIsActive(false);
    setIsPaused(false);
    setTimer(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleLanguage = () => {
    setIsVietnamese(!isVietnamese);
  };

  return (
    <ImageBackground source={require('./assets/wp6772919.jpg')} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.settingsButton} onPress={toggleModal}>
          <Icon name="sliders" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{isVietnamese ? ' Bấm Giờ' : 'Stopwatch'}</Text>
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{formatTime(timer)}</Text>
        </View>
        <View style={styles.buttonContainer}>
          {!isActive && !isPaused ? (
            <TouchableOpacity style={styles.button} onPress={handleStart}>
              <Icon name="play" size={30} color="#fff" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={handlePause}>
                <Icon name="pause" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Icon name="rotate-right" size={30} color="#fff" />
              </TouchableOpacity>
              {isPaused && (
                <TouchableOpacity style={styles.button} onPress={handleContinue}>
                  <Icon name="play" size={30} color="#fff" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={toggleModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                <Icon name="times" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{isVietnamese ? 'Cài Đặt' : 'Settings'}</Text>
              <View style={styles.modalOption}>
                <Text style={styles.modalOptionText}>{isVietnamese ? 'Chuyển Đổi Ngôn Ngữ' : 'Change Language'}</Text>
                <Switch onValueChange={toggleLanguage} value={!isVietnamese} style={styles.switch} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: 'white',
  },
  timerContainer: {
    borderWidth: 4,
    borderColor: 'white',
    width: 250,
    height: 250,
    borderRadius: 250 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    fontSize: 50,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderWidth: 3,
    borderColor: 'gray',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switch: {
    marginLeft: 40,
  },
  modalOptionText: {
    fontSize: 18,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default App;
