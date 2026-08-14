"use client";
import {SiteHeader} from "../components/SiteHeader";
import {ProtectedPage} from "../components/ProtectedPage";
import {ReportWorkspace} from "../components/ReportWorkspace";
export default function Page(){return <main className="subPage testerHubPage"><SiteHeader/><ProtectedPage><section className="subHero shell"><p className="eyebrow"><span/>Beta workspace</p><h1>Play. Report. Improve.</h1><p className="lead">Follow every tester report, add a +1 to shared issues and capture feedback while you play.</p></section><ReportWorkspace/></ProtectedPage></main>}
