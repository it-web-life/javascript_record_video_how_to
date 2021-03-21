/**
 * @file ブラウザカメラから動画の録画をする機能
 */

/**
 * 動画の録画機能を付与する
 */
class VideoRecord {

  /**
   * @constractor
   * @param {Object} params 
   * @param {HTMLElement} params.$target カメラ映像をマウントする要素
   * @param {HTMLElement} params.$videoPlayer 録画した動画をマウントする要素
   * @param {HTMLElement} params.$recordStart 録画開始ボタン
   * @param {HTMLElement} params.$recordStop 録画停止ボタン
   * @param {HTMLElement} params.$playStart 再生ボタン
   * @param {HTMLElement} params.$download ダウンロードボタン
   */
  constructor({ $target, $videoPlayer, $recordStart, $recordStop, $playStart, $download }) {
    // 各要素
    this.$target = $target
    this.$videoPlayer = $videoPlayer
    this.$recordStart = $recordStart
    this.$recordStop = $recordStop
    this.$playStart = $playStart
    this.$download = $download

    this.initialize = this.initialize.bind(this)
    this.startRecording = this.startRecording.bind(this)
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.startPlaying = this.startPlaying.bind(this)
    this.download = this.download.bind(this)

    // 設定の初期化処理
    this.initialize()

    // イベント設定
    this.$recordStart.addEventListener('click', this.startRecording)
    this.$recordStop.addEventListener('click', this.stopRecording)
    this.$playStart.addEventListener('click', this.startPlaying)
    this.$download.addEventListener('click', this.download)
  }

  /**
   * 録画関連の初期化処理
   */
  async initialize() {
    this.mediaStream = null
    this.mediaRecorder = null

    // Blob
    this.recordedChunks = []
    this.superBuffer = null

    this.$videoPlayer.src = null
    this.$videoPlayer.srcObject = null

    // ボタンの表示初期化
    this.$recordStart.disabled = false
    this.$recordStop.disabled = true
    this.$playStart.disabled = true
    this.$download.disabled = true

    // カメラ・音声の取得
    try {
      const mediaDevicesConstraints = {
        audio: true,
        video: { width: 1280, height: 720 }
      }

      // デバイスの動画・音声トラックを取得
      this.mediaStream = await navigator.mediaDevices.getUserMedia(mediaDevicesConstraints)

      // MediaStreamを設定して表示する
      this.$target.srcObject = this.mediaStream
      this.$target.play()
    } catch (err) {
      throw new Error(err)
    }
  }

  /**
   * 録画を開始する
   */
  startRecording() {
    // 録画機能の生成
    this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType: 'video/webm; codecs=vp8' });
    // availableイベントでメディア記録を保持
    this.mediaRecorder.ondataavailable = event => this.recordedChunks.push(event.data)
    // 録画開始
    this.mediaRecorder.start()

    console.log('this.superBuffer', this.superBuffer)
    if (this.superBuffer) {
      // メモリ解放
      URL.revokeObjectURL(this.superBuffer)
    }

    // ボタンの表示更新 (動画停止を許可)
    this.$recordStop.disabled = false

    console.log('MediaRecorder start')
  }

  /**
   * 録画を停止する
   */
  stopRecording() {
    // 録画停止
    this.mediaRecorder.stop()

    // ボタンの表示更新 (動画再生・ダウンロードを許可)
    this.$playStart.disabled = false
    this.$download.disabled = false

    console.log('MediaRecorder stop')
  }

  /**
   * 動画を再生する
   */
  startPlaying() {
    // webm形式でBlobで取得
    this.superBuffer = new Blob(this.recordedChunks, { type: "video/webm" });

    // BlobをURLに変換して設定
    this.$videoPlayer.src = URL.createObjectURL(this.superBuffer)
    this.$videoPlayer.controls = true;

    // 動画の再生
    this.$videoPlayer.play()

    console.log('Video playing')
  }

  /**
   * ダウンロードする
   */
  download() {
    const blob = new Blob(this.recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    a.href = url
    a.download = 'video.webm'
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    console.log('Video download')
  }
}

/**
 * 動画の録画処理を生成する
 */
export const createVideoRecord = () => {
  // .js-video-recordの要素をすべて取得
  const targets = [...document.getElementsByClassName('js-video-record')]

  // 各要素の録画機能設定をする
  for (const target of targets) {
    /** トリガーとなるセレクター名を取得する */
    // 動画の再生プレイヤー
    const videoPlayer = target.getAttribute('data-video-player')
    if (!videoPlayer) {
      console.error('data-video-player is required.')
      continue;
    }

    // 録画の開始ボタン
    const recordStart = target.getAttribute('data-record-start')
    if (!recordStart) {
      console.error('data-record-start is required.')
      continue;
    }

    // 録画の停止ボタン
    const recordStop = target.getAttribute('data-record-stop')
    if (!recordStop) {
      console.error('data-record-stop is required.')
      continue;
    }

    // 動画の再生ボタン
    const playStart = target.getAttribute('data-play-start')
    if (!playStart) {
      console.error('data-play-start is required.')
      continue;
    }

    // 動画をダウンロードするボタン
    const download = target.getAttribute('data-download')
    if (!download) {
      console.error('data-download is required.')
      continue;
    }

    /** トリガーとなる各セレクターを取得する */
    // 動画の再生プレイヤー
    const $videoPlayer = document.querySelector(videoPlayer);
    if (!$videoPlayer) {
      console.error('videoPlayer Selector does not exist.')
      continue;
    }

    // 録画の開始ボタン
    const $recordStart = document.querySelector(recordStart);
    if (!$recordStart) {
      console.error('recordStart Selector does not exist.')
      continue;
    }

    // 録画の停止ボタン
    const $recordStop = document.querySelector(recordStop);
    if (!$recordStop) {
      console.error('recordStop Selector does not exist.')
      continue;
    }

    // 動画の再生ボタン
    const $playStart = document.querySelector(playStart);
    if (!$playStart) {
      console.error('playStart Selector does not exist.')
      continue;
    }

    // 動画をダウンロードするボタン
    const $download = document.querySelector(download);
    if (!$download) {
      console.error('download Selector does not exist.')
      continue;
    }

    // インスタンスの作成
    new VideoRecord({
      $target: target,
      $videoPlayer,
      $recordStart,
      $recordStop,
      $playStart,
      $download
    })
  }
}
