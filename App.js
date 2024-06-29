import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Modal, Image, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

// Component Stopwatch
const Stopwatch = ({ isVietnamese }) => {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const countRef = useRef(null);
  const interval = 1000;

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

  return (
    <View style={stopwatchStyles.container}>
      <Text style={stopwatchStyles.title}>{isVietnamese ? 'Bấm Giờ' : 'Stopwatch'}</Text>
      <View style={stopwatchStyles.timerContainer}>
        <Text style={stopwatchStyles.timer}>{formatTime(timer)}</Text>
      </View>
      <View style={stopwatchStyles.buttonContainer}>
        {!isActive && !isPaused ? (
          <TouchableOpacity style={stopwatchStyles.button} onPress={handleStart}>
            <Icon name="play" size={30} color="#fff" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={stopwatchStyles.button} onPress={handlePause}>
              <Icon name="pause" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={stopwatchStyles.button} onPress={handleReset}>
              <Icon name="rotate-right" size={30} color="#fff" />
            </TouchableOpacity>
            {isPaused && (
              <TouchableOpacity style={stopwatchStyles.button} onPress={handleContinue}>
                <Icon name="play" size={30} color="#fff" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

// Component Timer 
const Timer = () => {
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedSecond, setSelectedSecond] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const hoursRef = useRef(null);
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingTime]);

  useEffect(() => {
    if (hoursRef.current) {
      scrollToItem(hoursRef, selectedHour);
    }
    if (minutesRef.current) {
      scrollToItem(minutesRef, selectedMinute);
    }
    if (secondsRef.current) {
      scrollToItem(secondsRef, selectedSecond);
    }
  }, [selectedHour, selectedMinute, selectedSecond]);

  const handleStart = () => {
    const totalSeconds = selectedHour * 3600 + selectedMinute * 60 + selectedSecond;
    setRemainingTime(totalSeconds);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleContinue = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingTime(0);
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const displayTime = () => {
    const h = Math.floor(remainingTime / 3600);
    const m = Math.floor((remainingTime % 3600) / 60);
    const s = remainingTime % 60;
    return `${formatTime(h)} : ${formatTime(m)} : ${formatTime(s)}`;
  };

  const scrollToItem = (ref, index) => {
    ref.current.scrollTo({ y: index * 40, animated: true });
  };

  const handleScroll = (setFunction) => {
    return ({ nativeEvent }) => {
      const index = Math.round(nativeEvent.contentOffset.y / 40);
      setFunction(index);
    };
  };

  const generateScrollViewItems = (max) => {
    return Array.from(Array(max).keys()).map((value) => (
      <View key={value} style={timerStyles.pickerItem}>
        <Text style={timerStyles.pickerText}>{formatTime(value)}</Text>
      </View>
    ));
  };

  return (
    <View style={timerStyles.container}>
      {remainingTime === 0 && !isRunning && !isPaused ? (
        <>
          <View style={timerStyles.pickerContainer}>
            <ScrollView
              ref={hoursRef}
              contentContainerStyle={timerStyles.scrollViewContent}
              style={timerStyles.scrollView}
              onScroll={handleScroll(setSelectedHour)}
              snapToInterval={40}
              decelerationRate="fast"
              showsVerticalScrollIndicator={false}
            >
              {generateScrollViewItems(24)}
            </ScrollView>
            <Text style={timerStyles.separator}>:</Text>
            <ScrollView
              ref={minutesRef}
              contentContainerStyle={timerStyles.scrollViewContent}
              style={timerStyles.scrollView}
              onScroll={handleScroll(setSelectedMinute)}
              snapToInterval={40}
              decelerationRate="fast"
              showsVerticalScrollIndicator={false}
            >
              {generateScrollViewItems(60)}
            </ScrollView>
            <Text style={timerStyles.separator}>:</Text>
            <ScrollView
              ref={secondsRef}
              contentContainerStyle={timerStyles.scrollViewContent}
              style={timerStyles.scrollView}
              onScroll={handleScroll(setSelectedSecond)}
              snapToInterval={40}
              decelerationRate="fast"
              showsVerticalScrollIndicator={false}
            >
              {generateScrollViewItems(60)}
            </ScrollView>
          </View>
          <TouchableOpacity style={stopwatchStyles.button} onPress={handleStart}>
            <Icon name="play" size={30} color="#fff" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={timerStyles.timer}>{displayTime()}</Text>
          <View style={timerStyles.buttonContainer}>
            {isRunning ? (
              <TouchableOpacity style={stopwatchStyles.button} onPress={handlePause}>
                <Icon name="pause" size={30} color="#fff" />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={stopwatchStyles.button} onPress={handleContinue}>
                  <Icon name="play" size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={stopwatchStyles.button} onPress={handleReset}>
                  <Icon name="rotate-right" size={30} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

// Component MainLayout
const MainLayout = ({ isVietnamese, isModalVisible, toggleModal, toggleLanguage, setMode, mode, selectedLanguage }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <ImageBackground source={require('./assets/wp6772919.jpg')} style={appStyles.background}>
      <View style={appStyles.container}>
        <TouchableOpacity style={appStyles.settingsButton} onPress={toggleModal}>
          <Icon name="sliders" size={30} color="#fff" />
        </TouchableOpacity>
        {mode === 'stopwatch' ? (
          <Stopwatch isVietnamese={isVietnamese} />
        ) : (
          <Timer />
        )}
        <View style={appStyles.switchContainer}>
          <TouchableOpacity onPress={() => setMode('stopwatch')}>
            <Text style={[appStyles.switchText, mode === 'stopwatch' ? appStyles.activeSwitchText : appStyles.inactiveSwitchText]}>
              {isVietnamese ? 'Bấm Giờ' : 'Stopwatch'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('timer')}>
            <Text style={[appStyles.switchText, mode === 'timer' ? appStyles.activeSwitchText : appStyles.inactiveSwitchText]}>
              {isVietnamese ? 'Đếm Giờ' : 'Timer'}
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={toggleModal}
        >
          <View style={appStyles.modalBackground}>
            <View style={appStyles.modalContainer}>
              <TouchableOpacity style={appStyles.closeButton} onPress={toggleModal}>
                <Icon name="times" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={appStyles.modalTitle}>{isVietnamese ? 'Cài Đặt' : 'Setting'}</Text>
              <View style={appStyles.modalOption}>
                <Text style={appStyles.modalOptionText}>{isVietnamese ? 'Ngôn Ngữ :' : 'Language :'}</Text>
                <TouchableOpacity onPress={handleDropdownToggle} style={appStyles.dropdownContainer}>
                  {selectedLanguage.key && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image source={selectedLanguage.key === 'VI' ? require('./assets/th.jpg') : require('./assets/th (1).jpg')} style={appStyles.flag} />
                      <Text style={appStyles.dropdownText}>
                        {selectedLanguage.label}
                      </Text>
                    </View>
                  )}
                  <Icon name={isDropdownOpen ? 'angle-up' : 'angle-down'} size={15} color="#000" />
                </TouchableOpacity>
                {isDropdownOpen && (
                  <View style={[appStyles.dropdownList, { width: 150, paddingVertical: 10, paddingHorizontal: 0, borderWidth: 1, borderColor: '#ccc' }]}>
                    <ScrollView>
                      <TouchableWithoutFeedback onPress={() => {toggleLanguage({ key: 'VI', label: 'VI' }); handleDropdownToggle(); }}>
                        <View style={appStyles.dropdownItem}>
                          <Image source={require('./assets/th.jpg')} style={appStyles.flag} />
                          <Text style={appStyles.languageText}>VI</Text>
                        </View>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback onPress={() => {toggleLanguage({ key: 'EN', label: 'EN' }); handleDropdownToggle(); }}>
                        <View style={appStyles.dropdownItem}>
                          <Image source={require('./assets/th (1).jpg')} style={appStyles.flag} />
                          <Text style={appStyles.languageText}>EN</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

// Component App
const App = () => {
  const [isVietnamese, setIsVietnamese] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mode, setMode] = useState('stopwatch');
  const [selectedLanguage, setSelectedLanguage] = useState({ key: 'VI', label: 'VI' });

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleLanguage = (language) => {
    setSelectedLanguage(language);
    setIsVietnamese(language.key === 'VI');
  };

  return (
    <MainLayout
      isVietnamese={isVietnamese}
      isModalVisible={isModalVisible}
      toggleModal={toggleModal}
      toggleLanguage={toggleLanguage}
      setMode={setMode}
      mode={mode}
      selectedLanguage={selectedLanguage}
    />
  );
};

// Styles
const appStyles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  switchContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
  },
  switchText: {
    fontSize: 20,
    marginHorizontal: 20,
    color: 'white',
  },
  activeSwitchText: {
    opacity: 1,
  },
  inactiveSwitchText: {
    opacity: 0.5,
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 25,
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalOptionText:{
    fontSize: 20,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginLeft: 15, 
  },
  dropdownText: {
    fontSize: 16,
    marginRight: 10,
  },
  dropdownList: {
    position: 'absolute',
    top: 50, 
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    elevation: 5,
    right: -25,
  },
  dropdownItem: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 5,
  },
  languageText: {
    fontSize: 16,
  },
});

const stopwatchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: 'white',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: 'white',
  },
});

const timerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#fff',
    marginHorizontal: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scrollView: {
    height: 120,
    width: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  scrollViewContent: {
    paddingVertical: 40,
  },
  pickerItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerText: {
    color: '#fff',
    fontSize: 20,
  },
  separator: {
    color: '#fff',
    fontSize: 30,
    marginHorizontal: 10,
  },
});

export default App;