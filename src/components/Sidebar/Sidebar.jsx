import React, { useContext, useState } from 'react'
import './Sidebar.css'
import {assets} from '../../assets/assets'
import { Context } from '../../context/ContextProvider'

const Sidebar = () => {

  const [extended, setExended] = useState(true)
  const {onSent, prevPrompts, setRecentPrompt, newChat, chatSessions, currentChatSessionId, selectChatSession} = useContext(Context)

  const loadChat = async (id) => {
    selectChatSession(id);
    // When loading a chat, we might want to re-run the last prompt to display the result,
    // or simply display the stored messages. For now, we'll just select the session.
    // The Main component will handle displaying the messages from the selected session.
  }

  return (
    <div className='sidebar'>
      <div className="top">
        <img onClick={()=> setExended(prev =>!prev)} className='menu' src={assets.menu_icon} alt="" />
        <div onClick={()=>newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="" />
          {extended?<p>New Chat</p>:null}
        </div>
        {extended?
        <div className="recent">
          <p className='recent-title'>Recent</p>
          {chatSessions.map((session, index) => {
            // Only display sessions that have a title other than "New Chat" or have messages
            if (session.title !== "New Chat" || session.messages.length > 0) {
              return (
                <div
                  key={session.id}
                  onClick={() => loadChat(session.id)}
                  className={`recent-entry ${session.id === currentChatSessionId ? 'active-chat' : ''}`}
                >
                  <img src={assets.message_icon} alt="" />
                  <p>{session.title}</p>
                </div>
              )
            }
            return null;
          })}
        </div>:null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended?<p>Help</p>:null}
        </div>

        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended?<p>Settings</p>:null}
        </div>

        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
         { extended?<p>Activity</p>:null}
        </div>
        

      </div>
    </div>
  )
}

export default Sidebar
