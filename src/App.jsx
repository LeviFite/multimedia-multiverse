
import React, { useEffect, useMemo, useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal, Button, Form, Navbar, Nav, Container, Row, Col, Card, Badge, InputGroup, Dropdown, Spinner, Alert } from 'react-bootstrap';
import { MessageSquare, Film, Music2, Image as ImageIcon, Gamepad2, BookOpen, Cpu, Globe2, HelpCircle, Briefcase, Home, Download, User2, Layers, BellRing } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

/*
  One‑page React + Bootstrap forum with optional Supabase backend.
  - Email/password auth (Supabase) with local fallback
  - Subscribe button
  - 10 icon categories with large modals
  - Downloads section
  - Profile with avatar/media uploads (Supabase Storage bucket `media` or local object URLs)
  - Threads CRUD: insert + paged feed from `threads` table (fallback to placeholders)
  - Sticky navbar, big modals, endless feed, pastel/earth-tone theme
*/

const THEME = {
  bg: "#faf7f2",
  text: "#1f1f1f",
  surface: "#ffffff",
  primary: "#7aa27d",
  secondary: "#f2a6a0",
  accent: "#a3c2e2",
  accent2: "#e7d28b",
  accent3: "#c9b6a9",
};

// --- Supabase config (set via Vite env) ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
export const REMOTE_ENABLED = !!supabase;

const CATEGORIES = [
  { key: 'general', label: 'General', icon: MessageSquare, color: THEME.accent3 },
  { key: 'movies', label: 'Movies', icon: Film, color: THEME.accent },
  { key: 'music', label: 'Music', icon: Music2, color: THEME.secondary },
  { key: 'photos', label: 'Photography', icon: ImageIcon, color: THEME.accent2 },
  { key: 'gaming', label: 'Gaming', icon: Gamepad2, color: THEME.accent },
  { key: 'learn', label: 'Learning', icon: BookOpen, color: THEME.accent3 },
  { key: 'tech', label: 'Tech', icon: Cpu, color: THEME.accent2 },
  { key: 'world', label: 'World', icon: Globe2, color: THEME.secondary },
  { key: 'help', label: 'Help', icon: HelpCircle, color: THEME.accent },
  { key: 'work', label: 'Careers', icon: Briefcase, color: THEME.accent3 },
];

const TOP_THREADS = [
  { title: 'Welcome! Read this first', author: 'ModTeam', replies: 42, category: 'general' },
  { title: 'Best camera phone in 2025?', author: 'PixelPioneer', replies: 31, category: 'photos' },
  { title: 'Your top 3 comfort movies', author: 'ReelFeely', replies: 64, category: 'movies' },
  { title: 'Share your study hacks', author: 'FocusBuddy', replies: 28, category: 'learn' },
  { title: 'Underrated indie games', author: 'QuestGiver', replies: 57, category: 'gaming' },
  { title: 'Daily music rec thread 🎧', author: 'CrateDigger', replies: 51, category: 'music' },
  { title: 'Resume roast (be nice)', author: 'HiringHelper', replies: 19, category: 'work' },
  { title: 'Laptop buyers guide', author: 'NerdBird', replies: 44, category: 'tech' },
  { title: 'Good deeds of the day', author: 'HelpHive', replies: 22, category: 'help' },
  { title: 'World news catch‑up', author: 'MapMaker', replies: 33, category: 'world' },
];

const DOWNLOADS = [
  { name: 'Community Guidelines.pdf', size: '320 KB' },
  { name: 'Media Pack.zip', size: '14.2 MB' },
  { name: 'Brand Palette (ASE).ase', size: '120 KB' },
  { name: 'Starter Templates.zip', size: '6.3 MB' },
];

const fakeHash = (s) => btoa(unescape(encodeURIComponent(s))).slice(0, 10);

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

function Avatar({ src, name, size = 56 }) {
  return (
    <div className="rounded-circle overflow-hidden border" style={{ width: size, height: size, background: '#ddd' }}>
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ fontWeight: 700, color: '#666' }}>
          {name?.[0]?.toUpperCase() || 'U'}
        </div>
      )}
    </div>
  );
}

function AuthModals({ show, onHide, onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      if (REMOTE_ENABLED) {
        if (isSignup) {
          const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { display_name: form.displayName } } });
          if (error) throw error;
        }
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (signInErr) throw signInErr;
        const u = data.user;
        const user = { id: u.id, email: u.email, displayName: u.user_metadata?.display_name || u.email.split('@')[0], avatar: '', bio: '', subscribed: false, media: [] };
        onLogin(user);
      } else {
        const user = { id: fakeHash(form.email), email: form.email, displayName: form.displayName || form.email.split('@')[0], avatar: '', bio: '', subscribed: false, media: [] };
        onLogin(user);
      }
      onHide();
    } catch (e) {
      setErr(e.message || 'Auth failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0" style={{ background: THEME.surface }}>
        <Modal.Title className="fw-bold">{isSignup ? 'Create your account' : 'Welcome back'}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: THEME.surface }}>
        {err && <Alert variant="danger" className="mb-3">{err}</Alert>}
        <Form onSubmit={handleSubmit}>
          {isSignup && (
            <Form.Group className="mb-3">
              <Form.Label>Display name</Form.Label>
              <Form.Control value={form.displayName} onChange={(e)=>setForm({ ...form, displayName: e.target.value })} placeholder="Levi F." required />
            </Form.Group>
          )}
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} required />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={form.password} onChange={(e)=>setForm({ ...form, password: e.target.value })} required />
            </Col>
          </Row>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button type="submit" className="me-2" disabled={busy} style={{ background: THEME.primary, borderColor: THEME.primary }}>
                {busy ? <Spinner size="sm" animation="border" /> : (isSignup ? 'Sign up' : 'Log in')}
              </Button>
              <Button variant="outline-secondary" onClick={onHide}>Cancel</Button>
            </div>
            <Button variant="link" onClick={()=>setIsSignup(!isSignup)}>
              {isSignup ? 'Have an account? Log in' : "New here? Create an account"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function CategoryModal({ category, show, onHide }) {
  if (!category) return null;
  const Icon = category.icon;
  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton style={{ background: THEME.surface }}>
        <Modal.Title className="d-flex align-items-center gap-2"><Icon size={24} /> {category.label} — Top Threads</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: THEME.surface }}>
        <Row className="g-4">
          {TOP_THREADS.filter(t => t.category === category.key || category.key === 'general').slice(0,8).map((t, idx) => (
            <Col md={6} key={idx}>
              <Card className="shadow-sm h-100" style={{ borderColor: category.color }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="secondary">{category.label}</Badge>
                    <small className="text-muted">{t.replies} replies</small>
                  </div>
                  <Card.Title>{t.title}</Card.Title>
                  <Card.Text className="text-muted">Started by <strong>{t.author}</strong>. Placeholder content lives here — add your forum data later.</Card.Text>
                  <Button variant="outline-dark">Open thread</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal.Body>
      <Modal.Footer style={{ background: THEME.surface }}>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Downloads() {
  return (
    <section id="downloads" className="py-5">
      <Container>
        <h2 className="mb-4">Downloads</h2>
        <div className="list-group">
          {DOWNLOADS.map((d, i) => (
            <a key={i} href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              <span>{d.name}</span>
              <Badge bg="light" text="dark">{d.size}</Badge>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Categories({ onOpen }) {
  return (
    <section id="categories" className="py-5" style={{ background: THEME.surface }}>
      <Container>
        <h2 className="mb-4">Categories</h2>
        <Row className="g-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Col key={cat.key} xs={6} md={4} lg={3}>
                <Card role="button" onClick={() => onOpen(cat)} className="text-center shadow-sm h-100" style={{ borderColor: cat.color }}>
                  <Card.Body>
                    <div className="d-flex justify-content-center mb-2">
                      <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 72, height: 72, background: cat.color }}>
                        <Icon size={36} />
                      </div>
                    </div>
                    <Card.Title className="fs-5">{cat.label}</Card.Title>
                    <Card.Text className="text-muted">Open the big modal to browse popular threads.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}

function Profile({ user, onUpdate }) {
  const [bio, setBio] = useState(user.bio || "I love building and sharing! ✨");
  const fileRef = useRef(null);
  const [media, setMedia] = useState(user.media || []);
  const [busy, setBusy] = useState(false);

  const uploadToSupabase = async (file) => {
    if (!REMOTE_ENABLED) return null;
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('media').upload(path, file, { upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleAvatar = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setBusy(true);
      let url = URL.createObjectURL(f);
      if (REMOTE_ENABLED) url = await uploadToSupabase(f);
      onUpdate({ ...user, avatar: url });
    } catch (err) { console.error(err); }
    finally { setBusy(false); }
  };

  const handleMedia = async (e) => {
    const files = Array.from(e.target.files || []);
    setBusy(true);
    try {
      const items = await Promise.all(files.map(async (f) => {
        let url = URL.createObjectURL(f);
        if (REMOTE_ENABLED) url = await uploadToSupabase(f);
        return ({ url, name: f.name });
      }));
      const next = [...media, ...items];
      setMedia(next);
      onUpdate({ ...user, media: next });
    } catch (err) { console.error(err); }
    finally { setBusy(false); }
  };

  useEffect(()=>{ onUpdate({ ...user, bio }); }, [bio]);

  return (
    <section id="profile" className="py-5" style={{ background: THEME.surface }}>
      <Container>
        <h2 className="mb-4">Your Profile</h2>
        <Card className="shadow-sm">
          <Card.Body>
            <Row className="g-4 align-items-center">
              <Col md={3} className="text-center">
                <Avatar src={user.avatar} name={user.displayName} size={96} />
                <div className="mt-3 d-grid gap-2">
                  <Button variant="outline-dark" onClick={()=>fileRef.current?.click()} disabled={busy}>{busy ? 'Uploading…' : 'Upload avatar'}</Button>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
                </div>
              </Col>
              <Col md={9}>
                <h4 className="mb-1">{user.displayName}</h4>
                <div className="text-muted mb-3">{user.email}</div>
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control as="textarea" rows={3} value={bio} onChange={(e)=>setBio(e.target.value)} placeholder="Tell the community about you…" />
                </Form.Group>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <Badge bg="light" text="dark">Theme: Pastel/Earth</Badge>
                  <Badge bg="secondary">Customization</Badge>
                  {REMOTE_ENABLED ? <Badge bg="success">Cloud uploads</Badge> : <Badge bg="warning" text="dark">Local demo</Badge>}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow-sm mt-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Your Media</h5>
              <div>
                <Form.Label className="btn btn-dark mb-0">Upload media
                  <Form.Control type="file" accept="image/*,video/*" multiple hidden onChange={handleMedia} />
                </Form.Label>
              </div>
            </div>
            <Row className="g-3">
              {media.length === 0 && <div className="text-muted">No media yet — upload images or videos to showcase on your profile.</div>}
              {media.map((m, idx) => (
                <Col key={idx} xs={6} md={4} lg={3}>
                  <Card className="h-100">
                    {m.url.match(/\.mp4|video\//) ? (
                      <video src={m.url} controls style={{ width:'100%', borderTopLeftRadius:'.25rem', borderTopRightRadius:'.25rem' }} />
                    ) : (
                      <Card.Img variant="top" src={m.url} alt={m.name} />
                    )}
                    <Card.Body className="py-2"><small className="text-muted">{m.name}</small></Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

// --- Threads CRUD (Supabase or local fallback) ---
const THREADS_TABLE = 'threads';

function NewThreadForm({ user, onCreated }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!user) { setErr('Please log in to post.'); return; }
    setBusy(true);
    try {
      if (REMOTE_ENABLED) {
        const { error } = await supabase.from(THREADS_TABLE).insert({ title, body, category, author_id: user.id, author_name: user.displayName });
        if (error) throw error;
      }
      onCreated?.();
      setTitle(''); setBody('');
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-3">Start a new thread</h5>
        {err && <Alert variant="danger">{err}</Alert>}
        <Form onSubmit={submit}>
          <Row className="g-2">
            <Col md={8}>
              <Form.Control placeholder="Thread title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
            </Col>
            <Col md={4}>
              <Form.Select value={category} onChange={(e)=>setCategory(e.target.value)}>
                {CATEGORIES.map(c=> <option key={c.key} value={c.key}>{c.label}</option>)}
              </Form.Select>
            </Col>
          </Row>
          <Form.Control as="textarea" rows={3} className="mt-2" placeholder="Write something…" value={body} onChange={(e)=>setBody(e.target.value)} />
          <div className="d-flex justify-content-end mt-2">
            <Button type="submit" disabled={busy} style={{ background: THEME.primary, borderColor: THEME.primary }}>{busy ? 'Posting…' : 'Post'}</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

function ThreadsFeed() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const load = async (reset=false) => {
    if (!REMOTE_ENABLED) {
      // fallback: map TOP_THREADS
      const start = reset ? 0 : rows.length;
      const more = TOP_THREADS.slice(start, start + pageSize).map((t,i)=>({
        id: `${start+i}`, title: t.title, body: 'Placeholder body', category: t.category, author_name: t.author, replies: t.replies, created_at: new Date().toISOString()
      }));
      setRows(reset ? more : [...rows, ...more]);
      if (reset) setPage(1); else setPage(page+1);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from(THREADS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .range(reset ? 0 : page * pageSize, (reset ? 0 : page * pageSize) + pageSize - 1);
    if (!error && data) {
      setRows(reset ? data : [...rows, ...data]);
      setPage(reset ? 1 : page + 1);
    }
    setLoading(false);
  };

  useEffect(()=>{ load(true); }, []);

  return (
    <section id="threads" className="py-5">
      <Container>
        <h2 className="mb-4">Forum Threads {REMOTE_ENABLED ? '' : <Badge bg="warning" text="dark" className="ms-2">Demo</Badge>}</h2>
        <Row className="g-4">
          {rows.map((r)=>(
            <Col md={6} key={r.id}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="dark" className="text-uppercase">{r.category}</Badge>
                    <small className="text-muted">{new Date(r.created_at).toLocaleString()}</small>
                  </div>
                  <Card.Title>{r.title}</Card.Title>
                  <Card.Text className="text-muted">By <strong>{r.author_name || 'Anon'}</strong></Card.Text>
                  <Card.Text>{r.body?.slice(0,140) || '—'}</Card.Text>
                  <Button variant="outline-dark">Open</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button variant="outline-dark" onClick={()=>load(false)} disabled={loading}>{loading ? 'Loading…' : 'Load more'}</Button>
        </div>
      </Container>
    </section>
  );
}

function TopThreads() {
  return (
    <section id="threads-top" className="py-5">
      <Container>
        <h2 className="mb-4">Top Threads</h2>
        <Row className="g-4">
          {TOP_THREADS.map((t, idx) => (
            <Col md={6} key={idx}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="dark" className="text-uppercase">{t.category}</Badge>
                    <small className="text-muted">{t.replies} replies</small>
                  </div>
                  <Card.Title>{t.title}</Card.Title>
                  <Card.Text className="text-muted">By <strong>{t.author}</strong> • Placeholder text.</Card.Text>
                  <Button variant="outline-dark">Open thread</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

function CategorySection({ onOpen }) {
  return <Categories onOpen={onOpen} />;
}

function App() {
  const [user, setUser] = useLocalStorage('demo_user', null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeCat, setActiveCat] = useState(null);

  const subscribed = !!user?.subscribed;

  const handleLogin = (u) => setUser(u);
  const handleLogout = async () => {
    if (REMOTE_ENABLED) { await supabase.auth.signOut(); }
    setUser(null);
  };
  const toggleSubscribe = () => setUser((u) => u ? { ...u, subscribed: !u.subscribed } : u);

  useEffect(() => {
    document.body.style.background = THEME.bg;
    document.body.style.color = THEME.text;
    if (REMOTE_ENABLED) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setUser((prev)=> prev || { id: data.user.id, email: data.user.email, displayName: data.user.user_metadata?.display_name || data.user.email.split('@')[0], avatar: '', bio: '', subscribed: false, media: [] });
        }
      });
    }
  }, []);

  return (
    <div>
      {/* Sticky Navbar */}
      <Navbar expand="lg" fixed="top" className="shadow-sm" style={{ background: THEME.surface }}>
        <Container>
          <Navbar.Brand href="#home" className="fw-bold d-flex align-items-center gap-2">
            <Layers size={22} /> CuteForum
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="align-items-lg-center">
              <Nav.Link href="#home" className="d-flex align-items-center gap-1"><Home size={18}/> Home</Nav.Link>
              <Nav.Link href="#downloads" className="d-flex align-items-center gap-1"><Download size={18}/> Downloads</Nav.Link>
              <Nav.Link href="#profile" className="d-flex align-items-center gap-1"><User2 size={18}/> Profile</Nav.Link>
              <Nav.Link href="#categories" className="d-flex align-items-center gap-1"><MessageSquare size={18}/> Categories</Nav.Link>
              <div className="vr mx-3 d-none d-lg-block"/>
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle as={Button} variant="outline-dark" className="d-flex align-items-center gap-2">
                    <Avatar src={user.avatar} name={user.displayName} size={24} />
                    <span className="d-none d-sm-inline">{user.displayName}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={()=>toggleSubscribe()} className="d-flex align-items-center gap-2">
                      <BellRing size={16}/> {subscribed ? 'Unsubscribe' : 'Subscribe'}
                    </Dropdown.Item>
                    <Dropdown.Divider/>
                    <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button onClick={()=>setShowAuth(true)} style={{ background: THEME.primary, borderColor: THEME.primary }}>Log in / Sign up</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero */}
      <section id="home" className="py-5" style={{ paddingTop: 88 }}>
        <Container>
          <Row className="align-items-center g-4">
            <Col md={6}>
              <h1 className="display-5 fw-bold">A cute, stylish media forum ✨</h1>
              <p className="lead">Endless scroll, big modals, profile uploads, and a one‑page flow — built with React + Bootstrap, pastel accents and earth tones.</p>
              <div className="d-flex gap-2">
                <Button size="lg" style={{ background: THEME.primary, borderColor: THEME.primary }} onClick={()=> user ? toggleSubscribe() : setShowAuth(true)}>
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                </Button>
                <Button size="lg" variant="outline-dark" onClick={()=>document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth'})}>Explore categories</Button>
              </div>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="ratio ratio-16x9">
                    <iframe title="placeholder" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowFullScreen></iframe>
                  </div>
                  <small className="text-muted">Replace with your featured trailer, reel, or forum intro.</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* New Thread + Live Threads Feed */}
      {user && <NewThreadForm user={user} onCreated={()=>{ /* feed auto-queries on load-more */ }} />}
      <ThreadsFeed />

      {/* Category Grid + Downloads + Profile + Endless feed */}
      <CategorySection onOpen={(c)=>setActiveCat(c)} />
      <Downloads />
      {user && <Profile user={user} onUpdate={setUser} />}
      <EndlessFeed />

      <footer className="py-5 mt-4" style={{ background: THEME.surface }}>
        <Container className="text-center text-muted">
          <div className="mb-2">Inspired by your uploaded index (animations, galleries, endless scrolling vibes).</div>
          <div>© {new Date().getFullYear()} CuteForum — demo build</div>
        </Container>
      </footer>

      {/* Large category modal */}
      <CategoryModal category={activeCat} show={!!activeCat} onHide={()=>setActiveCat(null)} />

      {/* Auth modal */}
      <AuthModals show={showAuth} onHide={()=>setShowAuth(false)} onLogin={handleLogin} />
    </div>
  );
}

function EndlessFeed() {
  const [items, setItems] = useState(Array.from({ length: 8 }, (_, i) => i));
  const sentinelRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setItems((prev) => [...prev, ...Array.from({ length: 6 }, (_, i) => prev.length + i)]);
        }
      });
    }, { rootMargin: '200px' });
    if (sentinelRef.current) io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="feed" className="py-5">
      <Container>
        <h2 className="mb-4">Latest From The Forum</h2>
        <Row className="g-4">
          {items.map((n) => (
            <Col md={6} key={n}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="dark">placeholder</Badge>
                    <small className="text-muted">#{n}</small>
                  </div>
                  <Card.Title>Sample Post Title #{n}</Card.Title>
                  <Card.Text className="text-muted">This is placeholder content for an endlessly scrolling media forum. Replace with live posts from your backend when ready.</Card.Text>
                  <Button variant="outline-dark">Open</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div ref={sentinelRef} className="text-center py-4 text-muted">Loading more…</div>
      </Container>
    </section>
  );
}

export default function Root() {
  return <App/>;
}
