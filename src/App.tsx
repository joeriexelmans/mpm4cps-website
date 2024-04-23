import * as React from "react";
import * as M from "@mantine/core";
import {useColorScheme, useWindowScroll} from '@mantine/hooks';
import {IconExternalLink} from '@tabler/icons-react';
import '@mantine/core/styles.css';
import preval from 'preval.macro'

import Home from "./pages/Home";
import CallForPapers from "./pages/CallForPapers";
import Program from "./pages/Program";
import Committees from "./pages/Committees";
import ImportantDates from "./pages/ImportantDates";
import Contacts from "./pages/Contacts";
import PreviousEvents from "./pages/PreviousEvents";

function toAnchor(text: string) {
  return "#" + text.replaceAll(" ", "");
}

export default function App(props: {}) {
  // detect if user has light or dark color scheme going on :)

  const theme = M.mergeMantineTheme(
    M.DEFAULT_THEME,
    M.createTheme({
      fontFamily: 'sans-serif',
      colors: {
        // Mantine will select various colors from this palette for light and dark theme.
        // Gradient from light to dark.
        // Generated with: https://mantine.dev/colors-generator/?color=1E3799
        MODELS_blue:
          [
            "#eef1fc",
            "#d9def2",
            "#afb9e7",
            "#8393dd",
            "#5e73d5",
            "#475ed0",
            "#3b54cf",
            "#2e45b7",
            "#273da4",
            "#1c3491"
          ],
      },
      primaryColor: 'MODELS_blue',
    }),
  );

  const preferredColorScheme = useColorScheme();
  const [navigationOpened, setNavigationOpened] = React.useState(false);
  const [scroll, scrollTo] = useWindowScroll();

  // Top bar size
  const HEADER_HEIGHT = 48;

  // How far to scroll when clicking on a navbar element?
  const SCROLL_OFFSET = HEADER_HEIGHT + 16;

  // For highlighting a navbar element: How soon to 'change' the current page?
  const NAVBAR_TOLERANCE = 32;

  // this array controls the order of the different sections, in the navigation panel and on the page
  // We have to repeat React.useRef() for every element, because React won't let us call it from a loop
  const pages: Array<[React.MutableRefObject<any>, string, React.ReactElement<any,any>]> = [
    [React.useRef(), "Home", <Home/>],
    [React.useRef(), "Call for Papers", <CallForPapers/>],
    [React.useRef(), "Important Dates", <ImportantDates/>],
    [React.useRef(), "Committees", <Committees/>],
    [React.useRef(), "Contacts", <Contacts/>],
    [React.useRef(), "Workshop Program", <Program/>],
    [React.useRef(), "Previous Events", <PreviousEvents/>],
  ];

  function navigateToRef(ref: React.MutableRefObject<any>) {
    const targetY = scroll.y + ref.current?.getBoundingClientRect().top - SCROLL_OFFSET;
    scrollTo({x: 0, y: targetY});
    setNavigationOpened(false);    
  }

  // The `preval` macro will run during build time:
  const lastUpdated = new Date(preval`module.exports = Date.now();`);

  // Compute the 'current page' to highlight in the navigation panel:
  const activeNavLink = pages.reduceRight((resultSoFar, [ref], index) => {
    // We iterate over the 'pages' array, from last to first element, and look for an element that we have scrolled passed.
    if (resultSoFar > 0) {
      // Already found our current page:
      return resultSoFar;
    }
    else {
      // Have we scrolled past the current element? :
      const elementRelativePosition = ref.current?.getBoundingClientRect().top;
      const scrolledPastElement = elementRelativePosition <= SCROLL_OFFSET + NAVBAR_TOLERANCE;
      return scrolledPastElement ? index : 0;
    }
  }, 0);

  // Navbar links
  const navLinks = pages.map(([ref, label, element], index) => {
    return <M.NavLink
      key={label}
      href={toAnchor(label)}
      label={label}
      onClick={() => navigateToRef(ref)}
      active={activeNavLink===index}
      variant="light"
    />;
  });

  return <>
  <M.MantineProvider theme={theme} forceColorScheme={preferredColorScheme}>
    <M.AppShell
      header={{ height: HEADER_HEIGHT }}
      navbar={{ width: 220, breakpoint: 'sm', collapsed: { mobile: !navigationOpened } }}
      padding="md">

      <M.AppShell.Header>
        <M.Group h="100%" px="md" style={{whiteSpace:"nowrap"}}>
          <M.Burger
            opened={navigationOpened}
            onClick={() => setNavigationOpened(navigationOpened => !navigationOpened)}
            hiddenFrom="sm"
            size="md" />
          <M.Title order={4}>
            <img style={{height: HEADER_HEIGHT-8+'px', verticalAlign: "-0.8rem"}} src="./logo128.png"/>
            &nbsp;
            MPM4CPS 2024
          </M.Title>
        </M.Group>
      </M.AppShell.Header>

      <M.AppShell.Navbar p="md" >
        <M.Stack justify="space-between" style={{height:"100%"}}>
          <div>
            {navLinks}
            {/* We 'hardcode' a special extra navbar element, i.e., the link to MODELS website: */}
            <M.NavLink
              href="https://conf.researchr.org/home/models-2024"
              target="_blank"
              label="MODELS 2024"
              leftSection={<IconExternalLink size="1rem"/>} />
          </div>
          <img src='./logo-MODELS-smaller.png' style={{width:200, marginRight: 'auto'}}/>
        </M.Stack>
      </M.AppShell.Navbar>

      <M.AppShell.Main>
        {pages.map(([ref, label, element], index) =>
          <div key={label}>
            {/* Turn title into a link: */}
            <M.Anchor
              ref={ref}
              href={toAnchor(label)}
              id={toAnchor(label)}
              onClick={() => navigateToRef(ref)}>
              <M.Title order={2}>{label}</M.Title>
            </M.Anchor>
            {element}
            {/* Dirty way of adding vertical space between the 'pages': */}
            <M.Space h="lg"/>
            <M.Divider/>
            <M.Space h="lg"/>
          </div>)}
        <div style={{height: '400px'}}/>
        <M.Text ta="right">Last updated: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}</M.Text>
      </M.AppShell.Main>

    </M.AppShell>
  </M.MantineProvider>
  </>;
}