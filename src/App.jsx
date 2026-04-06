import React, { useState, useContext, createContext, useRef, useCallback, useEffect } from 'react'
import { startGame, stopGame } from './assets/game/loader.js'
import photosIcon from './assets/icons/photos.svg'
import musicIcon from './assets/icons/music.svg'
import internetIcon from './assets/icons/internet.svg'
import arcadeIcon from './assets/icons/arcade.svg'

const DATA_BASE = 'https://raw.githubusercontent.com/vcastor/serverweb/main/server/data'

// Window Manager Context
const WindowManagerContext = createContext(null)

const useWindowManager = () => useContext(WindowManagerContext)

// Window Context for individual windows
const WindowContext = createContext(null)

const useWindow = () => useContext(WindowContext)

// Accordion Component for collapsible sections
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="accordion-item">
      <button
        className="accordion-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="accordion-icon">{isOpen ? '▼' : '▶'}</span>
        <span>{title}</span>
      </button>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="accordion-inner">
          {children}
        </div>
      </div>
    </div>
  )
}

// Window Content Components
const AboutMeContent = () => (
  <div className="window-content about-content">
    <div className="about-header">
      <div className="avatar-placeholder"><img src="/img/VCastor3.png" alt="avatar" /></div>
      <div className="about-intro">
        <h2>Victoria Castor</h2>
        <p className="subtitle"><i>aka</i> VCastor, an ordinary guy</p>
      </div>
    </div>

    <p className="window-text">hiya!, i'm vcastor (the v is silent), you can call me castor, victoria,
      vic, cas, victoire, as you wish.</p>

    <p className="window-text">Welcome to my webpage! If you're here
      for my CV, you can find a PDF version <a
      href="https://github.com/vcastor/cv/blob/main/cv_dark.pdf" target="_blank">here</a>.
      You'll also find all that info (and more!) in an
      interactive way here, in my little space of the internet.
    </p>

    <Accordion title="Hey, it's me">
      <p>I'm just your average person who spends way too much time surfing the web,
        aspiring to live like <a href="https://www.youtube.com/watch?v=yuTMWgOduFM"
        target="_blank">common people</a> —<i>renting a flat, getting a job...</i>— and
        occasionally questioning my life choices in front of a terminal.</p>

      <p>Music, computers and history are what i like. If you want a deep
        dive on cinema or literature, you'll have to look elsewhere —i'm still working
        on my "pretentious movie buff" phase. Not a traveler, neither a foodie, but i do
        enjoy discovering new places (on Google Maps) and cooking something edible
        (sometimes tasty).</p>

      <p> I'm that person who can show up in anything from a chinese qipao to a
        mexican huipil, or just a shirt and tie for maximum "why not" energy.
        Yes, i like fashion, but for not the trends —i'm more interested
        in what clothing says about time, place, weather, economy and personality.
      </p>

      <p> So yes, that's me vcastor, <a target="_blank" href="https://www.youtube.com/watch?v=XFkzRNyygfk"> i
        wish i was special</a>, but i'm not. Inspired by way too many cool people to
        list, but let's be honest: i'll probably never have an aesthetic desk setup
        like <a href="https://www.youtube.com/@maisyleigh" target="_blank">Maisy
        Leigh</a>, or if you were hoping for a documented creative pipeline like <a
        href="https://www.youtube.com/@shar" target="_blank">Shar</a> well... i'll break
        your heart, (though this site is inspired by <a
          href="https://www.sharyap.com" target="_blank">her website</a>).
        Realistically, i'm somewhere between <a
        href="https://www.youtube.com/@helloerika" target="_blank">hello erika </a>
        and <a href="https://www.youtube.com/@CompadreTlacuache"
        target="_blank">compadre tlacuache</a>, with a dash of being a <a
        href="https://www.youtube.com/watch?v=N2qk6VZokx0" target="_blank">good
        old-fashioned lover boy</a>.</p>

    </Accordion>
  </div>
)

const LinksContent = ({ openWindow }) => {
  const links = [
    { name: 'GitHub', icon: '🐙', url: 'https://github.com/vcastor' },
    { name: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com/in/vcastor/' },
    { name: 'Twitter', icon: '🐦', url: 'https://x.com/vcastorv' },
    { name: 'Instagram', icon: '📷', url: 'https://www.instagram.com/vcastorv/' },
    { name: 'Email', icon: '📧', url: 'mailto:vcastorv@gmai.com' },
    { name: 'OF', icon: '🔥', action: 'disclaimer' },
  ]

  const handleClick = (link) => {
    if (link.action === 'disclaimer') {
      openWindow('of-disclaimer', 'OnlyFans', <OFDisclaimerContent />, '🔥', { width: 400, height: 350 })
    } else {
      window.open(link.url, '_blank')
    }
  }

  return (
    <div className="window-content links-content">
      <h3>Find me online</h3>
      <div className="links-grid">
        {links.map((link) => (
          <div
            key={link.name}
            className="link-item"
            onClick={() => handleClick(link)}
          >
            <span className="link-icon">{link.icon}</span>
            <span>{link.name}</span>
          </div>
        ))}
      </div>
    <p className="links-note">Click the icons to visit my profiles</p>
    <p className="links-note">I'm cronically online, feel free to reach out!</p>
    </div>
  )
}

const OFDisclaimerContent = () => (
  <div className="window-content" style={{ textAlign: 'center', padding: 30 }}>
    <div style={{ fontSize: '4rem', marginBottom: 16 }}>😏</div>
    <h3 style={{ marginBottom: 12 }}>Nice try!</h3>
    <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
      I don't have an OnlyFans or PornHub.<br/>
      But i do have a GitHub with some spicy Fortran code.
    </p>
  </div>
)

const parseContent = (content) => {
  const parts = []
  let remaining = content
  const accordionRegex = /<Accordion title="([^"]+)">([\s\S]*?)<\/Accordion>/g
  let lastIndex = 0
  let match

  while ((match = accordionRegex.exec(content)) !== null) {
    const beforeAccordion = content.slice(lastIndex, match.index)
    if (beforeAccordion.trim()) {
      parts.push({ type: 'text', content: beforeAccordion })
    }
    parts.push({ type: 'accordion', title: match[1], content: match[2] })
    lastIndex = match.index + match[0].length
  }

  const afterLast = content.slice(lastIndex)
  if (afterLast.trim()) {
    parts.push({ type: 'text', content: afterLast })
  }

  return parts
}

const renderTextContent = (text) => {
  return text.split('\n\n').map((p, i) => {
    const cleaned = p.replace(/\n/g, ' ').trim()
    return cleaned && <p key={i} dangerouslySetInnerHTML={{ __html: cleaned }} />
  })
}

// Shared cache for posts.json (fetched once, used by BlogContent + PostContent)
let postsCache = null
const fetchPosts = () => {
  if (postsCache) return postsCache
  postsCache = fetch(`${DATA_BASE}/posts.json`).then(r => r.json())
  return postsCache
}

const BlogContent = ({ openPost }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts().then(data => { setPosts(data); setLoading(false) })
  }, [])

  if (loading) return <div className="window-content blog-content"><p>Loading...</p></div>

  return (
    <div className="window-content blog-content">
      <h3>Thoughts & Posts</h3>
      <p><a target="_blank"
        href="https://www.youtube.com/watch?v=b8-tXG8KrWs&list=RDVWjSXSpBKWk&index=6">Tell us a
        story, i know you're not boring</a></p>
      <div className="posts-list">
        {posts.map((post) => (
          <div
            key={post.id}
            className="post-card"
            onClick={() => openPost(post.id)}
          >
            {post.image && <img src={post.image} alt="" className="post-thumb" loading="lazy" />}
            <div className="post-info">
              <h4>{post.title}</h4>
              <span className="post-date">{post.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// PostContent looks up from the same cached posts.json
const PostContent = ({ postId }) => {
  const [post, setPost] = useState(null)

  useEffect(() => {
    fetchPosts().then(data => {
      setPost(data.find(p => p.id === postId) || null)
    })
  }, [postId])

  if (!post) return <div className="window-content post-content"><p>Loading...</p></div>

  const parts = parseContent(post.content)

  return (
    <div className="window-content post-content">
      {post.image && <img src={post.image} alt="" className="post-image" loading="lazy" />}
      <h2>{post.title}</h2>
      <span className="post-date">{post.date}</span>
      <div className="post-body">
        {parts.map((part, i) => {
          if (part.type === 'accordion') {
            return (
              <Accordion key={i} title={part.title}>
                {renderTextContent(part.content)}
              </Accordion>
            )
          }
          return <div key={i}>{renderTextContent(part.content)}</div>
        })}
      </div>
    </div>
  )
}

const WorkContent = ({ openProject }) => {
  const tools = [
    { name: 'Fortran', url: 'https://fortran-lang.org' },
    { name: 'python', url: 'https://python.org' },
    { name: 'LaTeX', url: 'https://www.latex-project.org' },
    { name: 'git', url: 'https://git-scm.com' },
    { name: 'SCM', url: 'https://www.scm.com' },
    { name: 'AIMAll', url: 'https://aim.tkgristmill.com' },
    { name: 'Inkscape', url: 'https://inkscape.org' },
    { name: 'GIMP', url: 'https://www.gimp.org' },
  ]

  const projects = [
    {
      id: 'researchment',
      title: 'Researchment',
      description: 'Postdoctoral researcher in computational chemistry.',
      hasDetails: true
    },
    {
      id: 'finance',
      title: 'Personal Finance Tracker',
      description: 'Web application with COBOL backend and modern JS frontend for multi-currency expense tracking.',
      hasDetails: false
    },
    {
      id: 'webpage',
      title: 'Personal Webpage',
      description: 'This web page you are visiting, built with React to mimic a desktop OS experience.',
      hasDetails: false
    },
  ]

  return (
    <div className="window-content work-content">

      <div className="tools-section">
        <h4>Tools, Technologies & Skills</h4>
        <div className="tags">
          { tools.map(tool => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              className="tag tag-link"
            >
              {tool.name}
            </a>
          )) }
        </div>
      </div>

      <div className="projects-section">
        <h4>Projects</h4>
        {projects.map(project => (
          <div
            key={project.id}
            className={`project-card ${project.hasDetails ? 'clickable' : ''}`}
            onClick={() => project.hasDetails && openProject(project.id)}
          >
            <h5>{project.title}</h5>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ProjectContent fetches from API
const ProjectContent = ({ projectId }) => {
  const [project, setProject] = useState(null)

  useEffect(() => {
    fetch(`${DATA_BASE}/projects.json`)
      .then(r => r.json())
      .then(data => setProject(data[projectId] || null))
  }, [projectId])

  if (!project) return <div className="window-content post-content"><p>Loading...</p></div>

  const parts = parseContent(project.content)

  return (
    <div className="window-content post-content">
      {project.image && <img src={project.image} alt="" className="post-image" loading="lazy" />}
      <h2>{project.title}</h2>
      <div className="post-body">
        {parts.map((part, i) => {
          if (part.type === 'accordion') {
            return (
              <Accordion key={i} title={part.title}>
                {renderTextContent(part.content)}
              </Accordion>
            )
          }
          return <div key={i}>{renderTextContent(part.content)}</div>
        })}
      </div>
    </div>
  )
}

// Photos gallery — fetches from API
const PhotosContent = () => {
  const [photos, setPhotos] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${DATA_BASE}/photos.json`)
      .then(r => r.json())
      .then(data => { setPhotos(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="window-content"><p>Loading photos...</p></div>

  return (
    <div className="window-content photos-content">
      <h3>Photos</h3>
      <p className="photos-subtitle">random moments, updated ever and anon</p>
      {selected && (
        <div className="photo-lightbox" onClick={() => setSelected(null)}>
          <img src={selected.src} alt={selected.caption || ''} />
          {selected.caption && <p className="photo-lightbox-caption">{selected.caption}</p>}
        </div>
      )}
      <div className="photos-grid">
        {photos.map(photo => (
          <div
            key={photo.id}
            className="photo-card"
            onClick={() => setSelected(photo)}
          >
            <img src={photo.src} alt={photo.caption || ''} loading="lazy" />
            {photo.caption && <span className="photo-caption">{photo.caption}</span>}
          </div>
        ))}
      </div>
      {photos.length === 0 && <p style={{ opacity: 0.6 }}>No photos yet — coming soon!</p>}
    </div>
  )
}

// Music recommendations — mosaic grid
const MusicContent = () => {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${DATA_BASE}/music.json`)
      .then(r => r.json())
      .then(data => { setTracks(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="window-content"><p>Loading...</p></div>

  return (
    <div className="window-content mosaic-content">
      <h3>Music</h3>
      <p className="mosaic-subtitle">stuff i've been listening to</p>
      <div className="mosaic-grid">
        {tracks.map(t => (
          <a
            key={t.id}
            className="mosaic-card"
            href={t.url}
            target="_blank"
            rel="noopener"
          >
            {t.cover
              ? <img src={t.cover} alt={t.title} className="mosaic-cover" loading="lazy" />
              : <div className="mosaic-cover mosaic-cover-placeholder">🎵</div>
            }
            <div className="mosaic-info">
              <span className="mosaic-title">{t.title}</span>
              <span className="mosaic-artist">{t.artist}</span>
              {t.note && <span className="mosaic-note">{t.note}</span>}
            </div>
          </a>
        ))}
      </div>
      {tracks.length === 0 && <p style={{ opacity: 0.6 }}>No tracks yet</p>}
    </div>
  )
}

// Internet bookmarks — mosaic grid
const BookmarksContent = () => {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${DATA_BASE}/bookmarks.json`)
      .then(r => r.json())
      .then(data => { setLinks(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="window-content"><p>Loading...</p></div>

  return (
    <div className="window-content mosaic-content">
      <h3>Internet</h3>
      <p className="mosaic-subtitle">corners of the web i love</p>
      <div className="mosaic-grid">
        {links.map(l => (
          <a
            key={l.id}
            className="mosaic-card"
            href={l.url}
            target="_blank"
            rel="noopener"
          >
            <div className="mosaic-cover mosaic-cover-placeholder">🌐</div>
            <div className="mosaic-info">
              <span className="mosaic-title">{l.title}</span>
              {l.description && <span className="mosaic-artist">{l.description}</span>}
            </div>
          </a>
        ))}
      </div>
      {links.length === 0 && <p style={{ opacity: 0.6 }}>No bookmarks yet</p>}
    </div>
  )
}

// Arcade — fullscreen takeover that loads the WASM game
const ArcadeOverlay = ({ onExit }) => {
  const containerRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Launch game into the container
    if (containerRef.current) {
      startGame(containerRef.current).then(() => setLoading(false))
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        stopGame()
        onExit()
      }
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      window.removeEventListener('keydown', handleKey)
      stopGame()
    }
  }, [onExit])

  const handleExit = () => {
    stopGame()
    onExit()
  }

  return (
    <div className="arcade-fullscreen">
      <div className="arcade-scanlines" />
      <div className="arcade-screen" ref={containerRef}>
        {loading && (
          <div className="arcade-placeholder">
            <p className="arcade-crt-text">LOADING GAME...</p>
          </div>
        )}
      </div>
      <button className="arcade-back-btn arcade-exit-fixed" onClick={handleExit}>
        ESC — EXIT
      </button>
    </div>
  )
}

const ArcadeContent = ({ onLaunch }) => (
  <div className="window-content arcade-content">
    <div className="arcade-splash">
      <div className="arcade-title-art">ARCADE</div>
      <p>press start to play</p>
      <button className="arcade-start-btn" onClick={onLaunch}>
        START
      </button>
      <p className="arcade-note">game coming soon — built in C++ compiled to WebAssembly</p>
    </div>
  </div>
)

const FAQsContent = ({ openPost }) => (
  <div className="window-content faqs-content">
    <h3>Frequently Asked Questions</h3>

    <Accordion title="What does vcastor do?" defaultOpen={true}>
      <p>VCastor is just trying not to die today, occasionally she writes code.</p>
    </Accordion>

    <Accordion title="What tools does she use?">
      <p>Primarily Fortran for my work, python for scripting, vim as my editor, and bash for automation,
      i have an entire <span className="inline-link" onClick={() => openPost('setup')}>post</span> dedicated to my set up.</p>
    </Accordion>

    <Accordion title="Can i see her code?">
      <p>Sure!, most of my projects are open source and available on my GitHub.</p>
    </Accordion>

    <Accordion title="Where does she live?">
      <p><a href="https://www.youtube.com/watch?v=FusIKjztap8" target="_blank">Here, there and everywhere.</a></p>
    </Accordion>
  </div>
)

// Window Component
const Window = ({ id, title, children, icon }) => {
  const { closeWindow, focusWindow, windows, updateWindowPosition, updateWindowSize, toggleMaximize } = useWindowManager()
  const windowRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const windowData = windows.find(w => w.id === id)
  if (!windowData) return null

  const { position, size, zIndex, isMaximized } = windowData

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return
    focusWindow(id)
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleResizeStart = (e) => {
    e.stopPropagation()
    focusWindow(id)
    setIsResizing(true)
    setDragOffset({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    })
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && !isMaximized) {
        updateWindowPosition(id, {
          x: Math.max(0, e.clientX - dragOffset.x),
          y: Math.max(0, e.clientY - dragOffset.y)
        })
      }
      if (isResizing && !isMaximized) {
        const newWidth = Math.max(300, dragOffset.width + (e.clientX - dragOffset.x))
        const newHeight = Math.max(200, dragOffset.height + (e.clientY - dragOffset.y))
        updateWindowSize(id, { width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, id, isMaximized])

  const windowStyle = isMaximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 80px)', zIndex }
    : { top: position.y, left: position.x, width: size.width, height: size.height, zIndex }

  return (
    <div
      ref={windowRef}
      className={`window ${isMaximized ? 'maximized' : ''}`}
      style={windowStyle}
      onMouseDown={() => focusWindow(id)}
    >
      <div className="window-glass-effect" />
      <div className="window-header" onMouseDown={handleMouseDown}>
        <div className="window-controls">
          <button className="control close" onClick={() => closeWindow(id)}>
            <span>×</span>
          </button>
          <button className="control maximize" onClick={() => toggleMaximize(id)}>
            <span>+</span>
          </button>
        </div>
        <div className="window-title">
          <span className="window-icon">{icon}</span>
          <span>{title}</span>
        </div>
        <div className="window-header-spacer" />
      </div>
      <div className="window-body">
        {children}
      </div>
      <div className="window-resize-handle" onMouseDown={handleResizeStart} />
    </div>
  )
}

// Dock Component
const Dock = () => {
  const { openWindow, windows, focusWindow } = useWindowManager()

  const handleOpenPost = (postId) => {
    openWindow(`post-${postId}`, postId, <PostContent postId={postId} />, '📄')
  }

  const handleOpenProject = (projectId) => {
    openWindow(`project-${projectId}`, projectId, <ProjectContent projectId={projectId} />, '🔭', { width: 600, height: 500 })
  }

  const dockItems = [
    { id: 'about', title: 'About Me', icon: '👩🏽‍🚀', content: <AboutMeContent />, size: { width: 750, height: 500 } },
    { id: 'links', title: 'Links', icon: '🔗', content: <LinksContent openWindow={openWindow} /> },
    { id: 'blog', title: 'Blog', icon: '📝', content: <BlogContent openPost={handleOpenPost}/> },
    { id: 'work', title: 'Work', icon: '💼', content: <WorkContent openProject={handleOpenProject} /> },
    { id: 'faqs', title: 'FAQs', icon: '❓', content: <FAQsContent openPost={handleOpenPost} /> },
  ]

  const handleDockClick = (item) => {
    const existingWindow = windows.find(w => w.id === item.id)
    if (existingWindow) {
      focusWindow(item.id)
    } else {
      openWindow(item.id, item.title, item.content, item.icon, item.size)
    }
  }

  return (
    <div className="dock-container">
      <div className="dock">
        {dockItems.map((item) => {
          const isOpen = windows.some(w => w.id === item.id)
          return (
            <button
              key={item.id}
              className={`dock-item ${isOpen ? 'active' : ''}`}
              onClick={() => handleDockClick(item)}
              title={item.title}
            >
              <span className="dock-icon">{item.icon}</span>
              <span className="dock-label">{item.title}</span>
              {isOpen && <span className="dock-indicator" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Desktop shortcut icon — uses SVG images
const DesktopShortcut = ({ icon, label, onClick }) => (
  <button className="desktop-shortcut" onClick={onClick} title={label}>
    <img className="desktop-shortcut-icon" src={icon} alt={label} draggable="false" />
    <span className="desktop-shortcut-label">{label}</span>
  </button>
)

// Desktop Component
const Desktop = ({ arcadeActive, setArcadeActive }) => {
  const { windows, openWindow } = useWindowManager()

  const handleOpenPhotos = () => {
    const existing = windows.find(w => w.id === 'photos')
    if (!existing) {
      openWindow('photos', 'Photos', <PhotosContent />, '🖼️', { width: 600, height: 500 })
    }
  }

  const handleOpenArcade = () => {
    const existing = windows.find(w => w.id === 'arcade')
    if (!existing) {
      openWindow('arcade', 'Arcade', <ArcadeContent onLaunch={() => setArcadeActive(true)} />, '👾', { width: 460, height: 380 })
    }
  }

  const handleOpenMusic = () => {
    const existing = windows.find(w => w.id === 'music')
    if (!existing) {
      openWindow('music', 'Music', <MusicContent />, '🎵', { width: 550, height: 480 })
    }
  }

  const handleOpenBookmarks = () => {
    const existing = windows.find(w => w.id === 'bookmarks')
    if (!existing) {
      openWindow('bookmarks', 'Internet', <BookmarksContent />, '🌐', { width: 550, height: 480 })
    }
  }

  return (
    <div className="desktop">
      <div className="desktop-greeting">
        <h1>VCastor</h1>
        <p>developer, scientist, arrogant</p>
      </div>

      <div className="desktop-shortcuts">
        <DesktopShortcut icon={photosIcon} label="Photos" onClick={handleOpenPhotos} />
        <DesktopShortcut icon={musicIcon} label="Music" onClick={handleOpenMusic} />
        <DesktopShortcut icon={internetIcon} label="Internet" onClick={handleOpenBookmarks} />
        <DesktopShortcut icon={arcadeIcon} label="Arcade" onClick={handleOpenArcade} />
      </div>

      {windows.map((win) => (
        <Window key={win.id} id={win.id} title={win.title} icon={win.icon}>
          {win.content}
        </Window>
      ))}

      {arcadeActive && <ArcadeOverlay onExit={() => setArcadeActive(false)} />}
    </div>
  )
}

// Window Manager Provider
const WindowManagerProvider = ({ children }) => {
  const [windows, setWindows] = useState([])
  const [maxZIndex, setMaxZIndex] = useState(100)

  const openWindow = useCallback((id, title, content, icon, customSize = null) => {
    setWindows(prev => {
      if (prev.find(w => w.id === id)) return prev
      const offset = prev.length * 30
      const defaultSize = { width: 500, height: 450 }
      return [...prev, {
        id,
        title,
        content,
        icon,
        position: { x: 100 + offset, y: 50 + offset },
        size: customSize || defaultSize,
        zIndex: maxZIndex + 1,
        isMaximized: false
      }]
    })
    setMaxZIndex(prev => prev + 1)
  }, [maxZIndex])

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }, [])

  const toggleMaximize = useCallback((id) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w
      if (w.isMaximized) {
        return {
          ...w,
          isMaximized: false,
          size: w.prevSize || { width: 500, height: 450 },
          position: w.prevPosition || { x: 100, y: 50 }
        }
      } else {
        return {
          ...w,
          isMaximized: true,
          prevSize: w.size,
          prevPosition: w.position,
          size: { width: window.innerWidth - 40, height: window.innerHeight - 120 },
          position: { x: 20, y: 20 }
        }
      }
    }))
  }, [])

  const focusWindow = useCallback((id) => {
    setWindows(prev => {
      const win = prev.find(w => w.id === id)
      if (!win || win.zIndex === Math.max(...prev.map(w => w.zIndex))) return prev
      const newZIndex = maxZIndex + 1
      setMaxZIndex(newZIndex)
      return prev.map(w => w.id === id ? { ...w, zIndex: newZIndex } : w)
    })
  }, [maxZIndex])

  const updateWindowPosition = useCallback((id, position) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position } : w))
  }, [])

  const updateWindowSize = useCallback((id, size) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size } : w))
  }, [])

  return (
    <WindowManagerContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      toggleMaximize
    }}>
      {children}
    </WindowManagerContext.Provider>
  )
}

// Main App
export default function App() {
  const [arcadeActive, setArcadeActive] = useState(false)

  return (
    <WindowManagerProvider>
      <div className="os-container">
        <Desktop arcadeActive={arcadeActive} setArcadeActive={setArcadeActive} />
        {!arcadeActive && <Dock />}
      </div>
    </WindowManagerProvider>
  )
}
