import { PageShell } from '../components/sections/Blocks';
import { site } from '../data/site';

export function Thanks() {
  return <PageShell title="Thanks" description="Your message reached Kean Edwards." path="/thanks" noindex />;
}

export function Privacy() {
  return (
    <>
      <PageShell title="Privacy" description="What this site collects, where it goes, and how to have it deleted." path="/privacy" />
      <article className="prose wrap" data-tone-hold>
        <p>Last updated November 7, 2026.</p>
        <p>This is my own website, and I’m the only person behind it. Here is exactly what it collects, where that goes, and what you can ask me to do with it. I don’t sell anything I collect, I don’t use it for advertising, and I don’t share it with anyone who isn’t listed below.</p>

        <h2>When you use the Hire me form</h2>
        <p>The form asks for:</p>
        <ul>
          <li>Your email address</li>
          <li>Your first and last name, and your phone number</li>
          <li>Your company name and website, if you add them</li>
          <li>The projects you’re interested in and your budget</li>
          <li>Anything you write about your company</li>
        </ul>
        <p>Your email address is sent to me as soon as you enter it on the first step, even if you don’t finish the rest of the form. That way I can still reply if something interrupts you. The rest is sent when you press Send.</p>
        <p>The form also notes which button or page you started from, so I know what brought you here.</p>
        <p>I use what you send only to reply to you and to do the work you ask about. I don’t add you to a mailing list.</p>

        <h2>Where your message goes</h2>
        <p>The form is delivered by <a href="https://formsubmit.co" target="_blank" rel="noopener noreferrer">FormSubmit</a>, a form service that emails it to my inbox. My email is a Gmail account, so your message is stored by Google. Both have their own privacy policies.</p>
        <p>If you call, text, or email me directly, those messages stay on my phone and in that same inbox.</p>

        <h2>Visits to the site</h2>
        <p>The site is hosted on <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">Vercel</a>. Like any web host, Vercel handles the technical details your browser sends when it loads a page, such as your IP address and browser type, in order to deliver the site.</p>
        <p>I use Vercel Web Analytics to count visits. It shows me things like which pages are read and roughly where visitors come from, in totals. It doesn’t use cookies and doesn’t tell me who you are. It also counts when someone sends the form, and from which page, but not what they wrote.</p>

        <h2>Tracking and Do Not Track</h2>
        <p>No third parties collect information about your activity across other websites through this site. Because the site doesn’t track you that way, it works the same whether or not your browser sends a Do Not Track signal.</p>

        <h2>Cookies and storage</h2>
        <p>This site doesn’t set any cookies. If you close the offer banner at the top of the page, your browser remembers that until you close the tab, so it doesn’t keep coming back. Nothing about that leaves your browser.</p>
        <p>The fonts are stored on this site, so loading a page doesn’t contact Google Fonts or any other font service.</p>

        <h2>Links to other sites</h2>
        <p>Pages here link to client websites, my photography, LinkedIn, and GitHub. Once you follow a link, that site’s own privacy policy applies.</p>

        <h2>How long I keep things</h2>
        <p>I keep messages for as long as we’re talking or working together, and afterward so I have a record of the work. You can ask me to delete them at any time.</p>

        <h2>What you can ask for</h2>
        <p>Email or text me and I will:</p>
        <ul>
          <li>Tell you what I have from you</li>
          <li>Correct anything that’s wrong</li>
          <li>Delete it</li>
        </ul>
        <p>Reach me at <a href={site.emailHref}>{site.email}</a> or <a href={site.phoneHref}>{site.phone}</a>.</p>

        <h2>Children</h2>
        <p>This site is for businesses and organizations. It isn’t meant for children under 13, and I don’t knowingly collect anything from them.</p>

        <h2>Changes</h2>
        <p>If the site starts collecting something new, I’ll update this page and the date at the top.</p>
      </article>
    </>
  );
}
