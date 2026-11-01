import { supabase } from "./lib/supabase";
const categories = ["Electronics & Gadgets","Phones & Accessories","Home & Kitchen","Furniture","Fashion & Accessories","Motorcycles & Parts"];
const products = [
 {name:"Smart TV",type:"Ready stock",price:"From GH₵ —",desc:"Add your current stock and selling price."},
 {name:"Kitchen appliance",type:"Pre-order",price:"From GH₵ —",desc:"Source from China through the next buying batch."},
 {name:"Home furniture",type:"Pre-order",price:"From $ —",desc:"Request a sourcing quote for your preferred model."}
];
export default async function Home() {
  const { data: products = [], error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Products loading error:", error.message);
  }

  return <main>
 <div className="top">CHINA 🇨🇳 TO GHANA 🇬🇭 <span>WhatsApp: +233 54 312 8235</span></div>
 <header><a className="logo" href="/">SAMMEX <b>IMPORTS</b></a><nav><a href="#shop">Shop</a><a href="#services">Import services</a><a href="#how">How it works</a><a href="#contact">Contact</a></nav><a className="navcta" href="https://wa.me/233543128235">Chat with us</a></header>
 <section className="hero"><div><p className="eyebrow">YOUR CHINA–GHANA SOURCING PARTNER</p><h1>Shop globally.<br/><em>Import confidently.</em></h1><p className="lead">Discover ready-stock products in Ghana or pre-order products sourced directly from China. Sammex Imports connects customers, retailers and importers to the products they need.</p><div className="actions"><a className="goldbtn" href="#shop">Explore products</a><a className="outlinebtn" href="#services">Import for business</a></div><small>Pre-order • Ready stock • Sourcing support</small></div><div className="hero-art"><div className="orb">S<br/><small>SI</small></div><div className="art-label">SAMMEX IMPORTS <span>CHINA → GHANA</span></div></div></section>
 <section className="trust"><div><b>01</b><span>Ready-stock shopping</span></div><div><b>02</b><span>China pre-orders</span></div><div><b>03</b><span>Importer support</span></div><div><b>04</b><span>GHS & USD display</span></div></section>
 <section id="shop" className="section"><div className="sectionhead"><div><p className="eyebrow">THE SAMMEX CATALOGUE</p><h2>Shop by category</h2></div><p>Browse products and check availability before placing your order.</p></div><div className="categories">{categories.map((c,i)=><div className="category" key={c}><span>0{i+1}</span><h3>{c}</h3><a href="https://wa.me/233543128235">Enquire →</a></div>)}</div><h2 className="featuredtitle">Featured products</h2><div className="products">{products.map(p=><article className="product" key={p.name}><div className="placeholder">SAMMEX <span>PRODUCT IMAGE</span></div><div className="productinfo"><span className={p.type==="Ready stock"?"stock":"pre"}>{p.type}</span><h3>{p.name}</h3><p>{p.desc}</p><b>{p.price}</b><a href="https://wa.me/233543128235">Ask about this product →</a></div></article>)}</div><p className="note">Product listings and prices shown here are starter placeholders. Add verified product photos, stock status and prices in the admin catalogue before launch.</p></section>
 <section id="services" className="services"><p className="eyebrow">FOR RETAILERS & IMPORTERS</p><h2>Need products directly from China?</h2><p>Tell us what you want to source. Our team can help with supplier enquiries, product purchasing coordination and importation support.</p><a className="goldbtn" href="https://wa.me/233543128235?text=Hello%20Sammex%20Imports%2C%20I%20need%20a%20sourcing%20quotation.">Request a sourcing quote</a></section>
 <section id="how" className="section"><p className="eyebrow">SIMPLE & TRANSPARENT</p><h2>How ordering works</h2><div className="steps"><div><b>01</b><h3>Choose your product</h3><p>Shop ready stock or request a China pre-order.</p></div><div><b>02</b><h3>Confirm your order</h3><p>Review the product, price, order terms and payment instructions.</p></div><div><b>03</b><h3>Receive your goods</h3><p>Ready-stock delivery is arranged locally. Pre-order shipping charges are calculated separately after arrival.</p></div></div><div className="policy"><b>Pre-order information</b><p>Estimated delivery is 45–60 working days after container purchase/shipment. Shipping fees are calculated separately after arrival. Order changes and cancellation requests are subject to Sammex's published 24-hour policy and processing status. Confirm the final terms at checkout.</p></div></section>
 <footer id="contact"><div><a className="logo" href="/">SAMMEX <b>IMPORTS</b></a><p>Your trusted connection to products from China.</p></div><div><b>Contact</b><p>+233 54 312 8235<br/>sammeximport@gmail.com</p></div><div><b>Currency</b><p>Ghana Cedi (GHS)<br/>US Dollar (USD)</p></div><div><b>Location</b><p>Serving customers across Ghana</p></div><small>© {new Date().getFullYear()} Sammex Imports. All rights reserved.</small></footer>
 </main>}
