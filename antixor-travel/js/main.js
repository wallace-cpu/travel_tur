import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

document.body.classList.add("loading");

window.addEventListener("load", () => {
  const tl = gsap.timeline();
  tl.to(".loader-line i", {width:"100%", duration:1.15, ease:"power2.inOut"})
    .to("#loader", {yPercent:-100, duration:.9, ease:"power4.inOut"})
    .from(".hero-reveal", {y:55, opacity:0, duration:.9, stagger:.1, ease:"power3.out"}, "-=.35")
    .from(".site-header", {y:-30, opacity:0, duration:.7, ease:"power3.out"}, "-=.7")
    .add(()=>document.body.classList.remove("loading"));
});

const canvas = document.querySelector("#world");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 100);
camera.position.z = 9;

const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.setSize(innerWidth, innerHeight);

const group = new THREE.Group();
scene.add(group);

const count = innerWidth < 700 ? 450 : 900;
const positions = new Float32Array(count * 3);
for(let i=0;i<count;i++){
  positions[i*3] = (Math.random()-.5)*20;
  positions[i*3+1] = (Math.random()-.5)*14;
  positions[i*3+2] = (Math.random()-.5)*12;
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions,3));
const material = new THREE.PointsMaterial({
  color:0x57c9ff, size:innerWidth<700?.018:.026, transparent:true, opacity:.34,
  depthWrite:false
});
const particles = new THREE.Points(geometry,material);
group.add(particles);

let targetX=0,targetY=0,scrollProgress=0;
window.addEventListener("pointermove",(e)=>{
  targetX=(e.clientX/innerWidth-.5)*.8;
  targetY=(e.clientY/innerHeight-.5)*.5;
});
window.addEventListener("scroll",()=>{
  scrollProgress=window.scrollY/(document.body.scrollHeight-innerHeight);
});
function animate(){
  requestAnimationFrame(animate);
  group.rotation.y += (targetX-group.rotation.y)*.012;
  group.rotation.x += (-targetY-group.rotation.x)*.012;
  particles.rotation.y += .00045 + scrollProgress*.0008;
  particles.position.y = scrollProgress*-.8;
  renderer.render(scene,camera);
}
animate();

addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

gsap.to(".hero-image",{
  yPercent:18, scale:1.13, ease:"none",
  scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1.3}
});
gsap.to(".hero-content",{
  yPercent:-18, opacity:.25, ease:"none",
  scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}
});
gsap.to(".floating-location",{
  x:100, y:-90, rotate:4, ease:"none",
  scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}
});
gsap.to(".search-card",{y:35, opacity:.85, scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});

gsap.utils.toArray(".benefits article").forEach((el,i)=>{
  gsap.from(el,{x:i%2?-50:50,opacity:0,duration:.8,ease:"power3.out",
    scrollTrigger:{trigger:".benefits",start:"top 78%",toggleActions:"play none none reverse"}});
});

gsap.from(".destination-card",{
  y:100,opacity:0,scale:.96,stagger:.1,duration:1,ease:"power3.out",
  scrollTrigger:{trigger:".destination-grid",start:"top 80%",toggleActions:"play none none reverse"}
});
gsap.utils.toArray(".destination-card").forEach(card=>{
  const speed=Number(card.dataset.speed||0);
  gsap.to(card,{y:speed*400,ease:"none",scrollTrigger:{trigger:".destination-grid",start:"top bottom",end:"bottom top",scrub:1}});
});

gsap.from(".reveal-x",{
  x:-130,opacity:0,duration:1.1,ease:"power4.out",
  scrollTrigger:{trigger:".featured",start:"top 75%",toggleActions:"play none none reverse"}
});
gsap.from(".reveal-x-right",{
  x:130,opacity:0,duration:1.1,ease:"power4.out",
  scrollTrigger:{trigger:".featured",start:"top 75%",toggleActions:"play none none reverse"}
});
gsap.to(".media-photo",{scale:1.15,ease:"none",scrollTrigger:{trigger:".featured",start:"top bottom",end:"bottom top",scrub:1.4}});

gsap.to(".story-photo",{scale:1.18,yPercent:5,ease:"none",scrollTrigger:{trigger:".story",start:"top bottom",end:"bottom top",scrub:1.2}});
gsap.from(".story-content > *",{x:-70,opacity:0,stagger:.12,duration:.9,ease:"power3.out",scrollTrigger:{trigger:".story",start:"top 70%"}});

gsap.from(".testimonial",{y:70,opacity:0,stagger:.12,duration:.8,ease:"power3.out",scrollTrigger:{trigger:".testimonials",start:"top 75%"}});
gsap.to(".final-bg",{scale:1.12,yPercent:5,ease:"none",scrollTrigger:{trigger:".final-cta",start:"top bottom",end:"bottom top",scrub:1.4}});
gsap.from(".final-content > *",{x:-80,opacity:0,stagger:.1,duration:.9,ease:"power3.out",scrollTrigger:{trigger:".final-cta",start:"top 72%"}});

document.querySelectorAll(".magnetic").forEach(btn=>{
  btn.addEventListener("pointermove",(e)=>{
    const r=btn.getBoundingClientRect();
    gsap.to(btn,{x:(e.clientX-r.left-r.width/2)*.16,y:(e.clientY-r.top-r.height/2)*.16,duration:.25});
  });
  btn.addEventListener("pointerleave",()=>gsap.to(btn,{x:0,y:0,duration:.5,ease:"elastic.out(1,.4)"}));
});

const glow=document.querySelector(".cursor-glow");
addEventListener("pointermove",(e)=>gsap.to(glow,{x:e.clientX,y:e.clientY,duration:.45,ease:"power2.out"}));

const modal=document.querySelector("#storyModal");
function openStory(){modal.style.display="flex";gsap.fromTo(modal,{opacity:0},{opacity:1,duration:.45});gsap.from("#storyModal>div",{y:50,opacity:0,duration:.7,ease:"power3.out"});document.body.style.overflow="hidden"}
function closeStory(){gsap.to(modal,{opacity:0,duration:.35,onComplete:()=>{modal.style.display="none";document.body.style.overflow=""}})}
document.querySelector("#playStory")?.addEventListener("click",openStory);
document.querySelector("#playStory2")?.addEventListener("click",openStory);
document.querySelector("#closeModal")?.addEventListener("click",closeStory);
modal.addEventListener("click",(e)=>{if(e.target===modal)closeStory()});

document.querySelector(".menu")?.addEventListener("click",()=>{
  document.querySelector(".nav").classList.toggle("mobile-open");
});

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const id=a.getAttribute("href");
    if(id && id!=="#"){
      const el=document.querySelector(id);
      if(el){e.preventDefault();window.scrollTo({top:el.offsetTop-20,behavior:"smooth"})}
    }
  });
});
