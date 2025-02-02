import React from 'react'
import '../styles/sidebar.css'
import {RssFeed,Chat, PlayCircleFilledOutlined,Group,Bookmark,
        HelpOutline,WorkOutline,Event,School} from '@mui/icons-material'


export default function Sidebar() {
    return(
        <div className='sidebar'>
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        <RssFeed className='sidebarIcon'/>
                        <span className="sidebarListItemText">Feed</span>
                    </li>
                    <li className="sidebarListItem">
                        <PlayCircleFilledOutlined className='sidebarIcon'/>
                        <span className="sidebarListItemText">Videos</span>
                    </li>
                    <li className="sidebarListItem">
                        <Bookmark className='sidebarIcon'/>
                        <span className="sidebarListItemText">Bookmarks</span>
                    </li>
                    <li className="sidebarListItem">
                        <HelpOutline className='sidebarIcon'/>
                        <span className="sidebarListItemText">Questions</span>
                    </li>
                    <li className="sidebarListItem">
                        <WorkOutline className='sidebarIcon'/>
                        <span className="sidebarListItemText">Jobs</span>
                    </li>
                    <li className="sidebarListItem">
                        <Event className='sidebarIcon'/>
                        <span className="sidebarListItemText">Events</span>
                    </li>
                    <li className="sidebarListItem">
                        <School className='sidebarIcon'/>
                        <span className="sidebarListItemText">Couseses</span>
                    </li>
                </ul>
            
            </div>
        </div>
    )
}
