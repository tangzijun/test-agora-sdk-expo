import { Button, PermissionsAndroid, Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { useEffect, useRef, useState } from 'react';
// 导入获取 Android 设备权限相关组件
// 导入声网 SDK
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
  AudienceLatencyLevelType,
} from 'react-native-agora';

const getPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  }
};

const appId = '8279c308fe76400386ef865ad501fb7d';
const token =
  '007eJxTYJh08W3arPsvzpz8Zap5grtP8KOBwzkHhmWHtPgC2f3m/4xQYLAwMrdMNjawSEs1NzMxMDC2MEtNszAzTUwxNTBMSzJPeZmknNoQyMiQMaGThZEBAkF8NoaS1OIS5wwGBgDBSyA+';
const channelName = 'testCh';
const uid = 0; // 本地用户 Uid，无需修改

function showMessage(...args: any) {
  console.info(args);
}

export default function TabOneScreen() {
  // 启动 App 时初始化引擎
  useEffect(() => {
    setupVideoSDKEngine();
  });

  const agoraEngineRef = useRef<IRtcEngine>();

  const [isJoined, setIsJoined] = useState(false);

  const [remoteUid, setRemoteUid] = useState(0);

  const setupVideoSDKEngine = async () => {
    try {
      // 获取设备权限后创建 RtcEngine
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();

      const agoraEngine = agoraEngineRef.current;

      console.info('setupVideoSDKEngine:', agoraEngine);

      // 注册回调事件
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          showMessage('成功加入频道：' + channelName);
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          showMessage('远端用户 ' + Uid + ' 已加入');
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          showMessage('远端用户 ' + Uid + '已离开频道');
          setRemoteUid(0);
        },
      });

      // 初始化引擎
      agoraEngine.initialize({
        appId: appId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>isJoined:{isJoined}</Text>
      <Text style={styles.title}>remoteUid:{remoteUid}</Text>
      <Button
        title='test'
        onPress={() => {
          console.info('test');
          // 开启本地视频
          agoraEngineRef.current?.enableVideo();
          // agoraEngineRef.current?.startPreview();
        }}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
