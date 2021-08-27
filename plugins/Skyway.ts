import { Component, Vue } from 'nuxt-property-decorator';
import Peer, { SfuRoom } from 'skyway-js';
import { SkywayMediaStream } from '../interfaces/skyway';
/// import { ChatMessage } from '../interfaces/skyway';

interface IData {
  peer: Peer | null;
  room: SfuRoom | null;
  localStream: MediaStream | undefined;
  isMute: boolean;
  remoteStreams: SkywayMediaStream[];
  chatMessage: string;
  // messageList: ChatMessage[];
}

@Component({
  props: {
    userName: {
      type: String,
      default: null,
    },
    roomName: {
      type: String,
      default: null,
    },
  },
  data(): IData {
    return {
      peer: null,
      room: null,
      localStream: undefined,
      isMute: false,
      remoteStreams: [],
      chatMessage: '',
      messageList: [],
    };
  },

  async mounted() {
    console.log('mounted')
  // PeerIdは設定可能。しない場合はランダムな16桁の文字列が返ってくる
    this.$data.peer = await new Peer(this.$props.userName, {
      key: '480047f3-ce43-4be1-aaee-60bb4446b5ca' || '',
      debug: 3,
    });
    this.$data.peer.on('open', this.connect);
  },

  connect() {
    if (!this.$data.peer || !this.$data.peer.open) {
      return;
    }
   
   // ルームに接続する
    this.$data.room = this.$data.peer.joinRoom(this.$props.roomName, {
      mode: 'sfu',
      stream: this.$data.localStream,
    }) as SfuRoom;

    if (this.$data.room) {
      // 他Peerからメディアストリームを受信した場合
      this.$data.room.on('stream', (stream: SkywayMediaStream): void => {
        this.$data.remoteStreams.push(stream);
      });

     // 他Peerがルームから去った場合
      this.$data.room.on('peerLeave', (peerId: string): void => {
        const audio = document.getElementById(peerId);
        if (audio) {
          audio.remove();
        }
        const newRemoteStreams = this.$data.remoteStreams.filter((item: SkywayMediaStream) => item.peerId !== peerId);
        this.$data.remoteStreams = newRemoteStreams;
      });

     // 他Peerからデータ（今回はチャットメッセージ）を受信した場合
      this.$data.room.on('data', ({ src, data }: any): void => {
        const msg = {
          id: src,
          text: data.text,
        };
        this.$data.messageList.push(msg);
      });

     // 他Peerがルームに入室した場合
      this.$data.room.on('peerJoin', (peerId: string): void => {
        console.log('新規入室者です', peerId);
      });
    }
  }
})