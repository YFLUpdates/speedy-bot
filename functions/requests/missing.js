import axios from 'axios';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

//decode base64 player :)

function missing (user){
    const request = axios.get(`https://xayo.pl/${user}`, {
        headers: {
          Referer: `https://xayo.pl/${user}`,
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
        }
      }).then(async function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });
        const xayoJson = JSON.parse(dom.window.document.getElementById("__NEXT_DATA__").textContent);
        const data = xayoJson.props.pageProps.chatEntry.lastSeen;

        if(data){
            return `${user} ostatnio był(a) widzany(a) u ${data.streamer.login} (${new Date(data.timestamp).toLocaleString("pl")}) oho`;
        }else{
            return `${user} nie był(a) nigdzie widziany(a) aha`;
        }

      }).catch(err => {
        //console.log(err)
        return `${user} nie był(a) nigdzie widziany(a) aha`;
      });

      return (request);
}
export default missing;