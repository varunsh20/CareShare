import { HuddleIframe } from "@huddle01/huddle01-iframe";
import "./conferenceStyles.css";

const Conference = () => {

  const iframeConfig = {
    roomUrl: "https://iframe.huddle01.com/",
    height: "100%",
    width: "100%",
    noBorder: true, // false by default
  };

  return (
    <div className="conf">
      <HuddleIframe config={iframeConfig} />
    </div>
  )
}

export default Conference