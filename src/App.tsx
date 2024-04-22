import * as React from "react";
import * as M from "@mantine/core";
import {useColorScheme, useScrollIntoView, useWindowScroll} from '@mantine/hooks';
import {IconRobot, IconExternalLink} from '@tabler/icons-react';
import '@mantine/core/styles.css';

import Home from "./Home";
import CallForPapers from "./CallForPapers";
import Program from "./Program";
import Committees from "./Committees";
import ImportantDates from "./ImportantDates";
import Contacts from "./Contacts";
import PreviousEvents from "./PreviousEvents";

// Set by WebPack during build:
declare const REVISION: string;

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
        MODELS_blue: [
          "#D2D7EB", "#A5AFD6", "#7887C2", "#4B5FAD", "#1E3799",
          "#1B328A", "#182C7A", "#15276B", "#12215C", "#0F1C4D",
        ],
      },
      primaryColor: 'MODELS_blue',
    }),
  );

  const preferredColorScheme = useColorScheme();
  const [opened, setOpened] = React.useState(false);
  const [scroll, scrollTo] = useWindowScroll();
  const [active, setActive] = React.useState(0);

  const NAVBARSIZE = 48;

  const scrollOptions = {
    offset: NAVBARSIZE+16,
    duration: 300, // milliseconds
  }

  // this array controls the order of the different sections, in the navigation panel and on the page
  const pages: Array<[string, React.ReactElement<any,any>, any]> = [
    ["Home", <Home/>, useScrollIntoView(scrollOptions)],
    ["Call for Papers", <CallForPapers/>, useScrollIntoView(scrollOptions)],
    ["Important Dates", <ImportantDates/>, useScrollIntoView(scrollOptions)],
    ["Committees", <Committees/>, useScrollIntoView(scrollOptions)],
    ["Contacts", <Contacts/>, useScrollIntoView(scrollOptions)],
    ["Workshop Program", <Program/>, useScrollIntoView(scrollOptions)],
    ["Previous Events", <PreviousEvents/>, useScrollIntoView(scrollOptions)],
  ];

  return <>
  <M.MantineProvider theme={theme} defaultColorScheme={preferredColorScheme}>
    <M.AppShell
      header={{ height: NAVBARSIZE }}
      navbar={{ width: 220, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"

    >
      <M.AppShell.Header>
        <M.Group h="100%" px="md" style={{whiteSpace:"nowrap"}}>
          <M.Burger
            opened={opened}
            onClick={() => setOpened(opened => !opened)}
            hiddenFrom="sm"
            size="md" />
          <M.Title order={4}>
            <img style={{height:NAVBARSIZE-8+'px', verticalAlign: "-0.8rem"}} src="./logo128.png"/>
            &nbsp;
            MPM4CPS 2024
          </M.Title>
        </M.Group>
      </M.AppShell.Header>
      <M.AppShell.Navbar p="md" >
        <M.Stack justify="space-between" style={{height:"100%"}}>
          <div>
            <>
            {(() => {
              return pages.map(([label, element, {targetRef, scrollIntoView}], index) => {
                return <M.NavLink
                  key={index}
                  href={toAnchor(label)}
                  label={label}
                  onClick={() => {
                    scrollIntoView();
                    setActive(index);
                    setOpened(false);
                  }}
                  active={active===index}
                  variant="light"
                />;
              });
            })()}
            <M.NavLink
              href="https://conf.researchr.org/home/models-2024"
              label="MODELS 2024"
              leftSection={<IconExternalLink size="1rem"/>} />
            </>
          </div>
          <img src='./logo-MODELS-smaller.png'/>
        </M.Stack>
      </M.AppShell.Navbar>
      <M.AppShell.Main style={{/* allow scrolling past bottom: */ marginBottom: "400px"}}>
        {pages.map(([label, element, {targetRef, scrollIntoView}]) => (<>
          <M.Anchor ref={targetRef} href={toAnchor(label)} id={toAnchor(label)}><M.Title order={2} mt="lg">{label}</M.Title></M.Anchor>
          {element}
        </>))}
      </M.AppShell.Main>
    </M.AppShell>
  </M.MantineProvider>
  </>;
}