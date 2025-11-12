import React, { useContext } from 'react'
import{assets} from "../../assets/assets"
import './Main.css'
import { Context } from '../../context/ContextProvider'

const Main = () => {

  const {onSent, recentPrompt, showResult, loading, setInput, input, newChat, chatSessions, currentChatSessionId} = useContext(Context)

  const currentSession = chatSessions.find(session => session.id === currentChatSessionId);
  const messagesToDisplay = currentSession ? currentSession.messages : [];

  return (
    <div className='main'>
      <div className="nav">
        <p onClick={()=>newChat()}>Gemini</p>
        <img width={55} height={55} src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {!showResult || messagesToDisplay.length === 0
        ?<>
          <div className="greet">
              <p><span>Hello , genius</span></p>
              <p>How can I help you today ?</p>
          </div>
          <div className="cards">
              <div className="card">
                  <p>
                      What are the top 10 ranked anime of all time
                  </p>
                  <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                  <p>
                      Briefly explain the concept of identity 
                  </p>
                  <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                  <p>
                     Why is react so popular for frontend developpment
                  </p>
                  <img src={assets.code_icon} alt="" />
              </div>
              <div className="card">
                  <p>
                     Suggest best places to study in as a CS student
                  </p>
                  <img src={assets.compass_icon} alt="" />
              </div>
          </div>
        </>
        :<div className='result'>
            {messagesToDisplay.map((message, index) => (
              <div key={message.id || index} className={message.role === "user" ? "result-title" : "result-data"}>
                <img src={message.role === "user" ? assets.user_icon : assets.gemini_icon} alt="" />
                {message.role === "user"
                ? <p>{message.text}</p>
                : loading && index === messagesToDisplay.length - 1 // Only show loader for the last Gemini message if loading
                  ? <div className='loader'>
                      <hr />
                      <hr />
                      <hr />
                    </div>
                  : <p dangerouslySetInnerHTML={{__html: message.text}}></p>
                }
              </div>
            ))}
        </div>
        }

        <div className="main-bottom">
            <div className="search-box">
                <input onKeyDown={(e) => e.key === 'Enter' && onSent()} onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Ask a question' />
                <div>
                    <img src={assets.gallery_icon} alt="" />
                    <img src={assets.mic_icon} alt="" />
                    <img onClick={()=>onSent()} src={assets.send_icon} alt="" />
                </div>
            </div>
            <p className='bottom-info'>
                Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
            </p>
        </div>
      </div>
    </div>
  )
}

export default Main
