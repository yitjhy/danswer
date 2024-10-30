import { youtubeDl } from "youtube-dl-exec";
import fs from 'fs'
import { AssemblyAI } from 'assemblyai'


const client = new AssemblyAI({
    apiKey: "f85381ac51af472982009f690b2a49ae"
})
 
const audioUrl2srt = async (audioUrl) => {
  console.log('音频Url',audioUrl)
  console.log('开始转文本...')
  const transcript = await client.transcripts.transcribe({audio_url: audioUrl})
  console.log(transcript.text)
  console.log('转文本结束')
  fs.writeFileSync('./videoText.txt',transcript.text)
  console.log("检索转录文本为字幕");
  const subtitles = await client.transcripts.subtitles(transcript.id, "srt");
  fs.writeFileSync('./subtitles.srt',subtitles)
  console.log('文本存储地址为 node_server 目录下, 文本文件名为 videoText.txt 和 subtitles.srt')
}

async function getYoutubeInfo (request,response){
    // const youtubeVideoUrl = "https://www.youtube.com/watch?v=wtolixa9XTg";
    let youtubeVideoUrl=request.query.url;
    if (!youtubeVideoUrl) {
      throw new Error("请提供url");
    }
    console.log("从 YouTube 视频检索音频 URL");
    const videoInfo = await youtubeDl(youtubeVideoUrl, {
      dumpSingleJson: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });
    const audioUrl = videoInfo.formats.reverse().find(
      (format) => format.resolution === "audio only" && format.ext === "m4a",
    )?.url;
    
    if (!audioUrl) {
      throw new Error("未找到仅音频格式");
    }
    const youTubeInfo = {
        audioUrl: audioUrl,
        tile: videoInfo.title,
        description: videoInfo.description,
        url: videoInfo.url
    }
    audioUrl2srt(audioUrl)
    response.send(youTubeInfo)
}
export default getYoutubeInfo