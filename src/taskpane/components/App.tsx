import * as React from 'react';
import Header from './Header';
import HeroList, { HeroListItem } from './HeroList';
import Progress from './Progress';
import debounce = require('lodash.debounce');
import { parseWordParagraphs, extractCitations, findOrphanedCitations, findOrphanedReferences } from '../../lib/functions';
import { Congratulations, Info, ReferenceErrors, Warning, CitationErrors, Citation, top20, Reference, Welcome } from './common';

const Result = (props: { totalCitations: number, totalReferences: number, orphanedCitations: readonly string[], orphanedReferences: readonly string[] }) =>
  <>
    <Info citationCount={props.totalCitations} referenceCount={props.totalReferences} />

    <CitationErrors count={props.orphanedCitations.length} />
    <Warning />
    {
      top20(props.orphanedCitations).map(c => <Citation citation={c} />)
    }

    <ReferenceErrors count={props.orphanedReferences.length} />
    <Warning />
    {
      top20(props.orphanedReferences).map(r => <Reference reference={r} />)
    }
  </>;

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
  initial: boolean;
  flawless: boolean;
  totalCitations: number;
  totalReferences: number;
  orphanedCitations: readonly string[];
  orphanedReferences: readonly string[];
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [{
        icon: 'DocumentManagement',
        primaryText: 'Automatic citation check'
      }, {
        icon: 'Education',
        primaryText: 'Avoid accidental plagiarism'
      }, {
        icon: 'Savings',
        primaryText: 'Free and Open Source'
      }],
      initial: true,
      flawless: false,
      totalCitations: 0,
      totalReferences: 0,
      orphanedCitations: [],
      orphanedReferences: [],
    };
  }

  click = async () => {
    return Word.run(async context => {
      const wordParagraphs = context.document.body.paragraphs.load('text');
      await context.sync();

      const [paragraphs, references] = parseWordParagraphs(wordParagraphs.items);
      const citations = extractCitations(paragraphs);

      this.setState({ initial: false });

      if (citations.length === 0 && references.length === 0) {
        this.setState({ flawless: true });
        return;
      }

      this.setState({
        totalCitations: citations.length,
        totalReferences: references.length,
        orphanedCitations: findOrphanedCitations(citations, references),
        orphanedReferences: findOrphanedReferences(citations, references),
      });
    }).catch(console.log);
  }

  clickDebounced = debounce(this.click, 500, {
    leading: true,
    trailing: false
  });

  render() {
    if (!this.props.isOfficeInitialized) {
      return <Progress />;
    }

    return (
      <>
        <div className='ms-welcome'>
          <Header />
          <HeroList message='Discover what Cite Sync can do!' items={this.state.listItems}>
            <div className="svg-wrapper" onClick={this.clickDebounced}>
              <svg height="40" width="150" xmlns="http://www.w3.org/2000/svg">
                <rect id="shape" height="40" width="150"></rect>
                <div id="text"><span className="spot"></span>Run Analysis</div>
              </svg>
            </div>
            {
              this.state.initial
                ? <Welcome />
                : (
                  this.state.flawless
                    ? <Congratulations />
                    : <Result
                      totalCitations={this.state.totalCitations}
                      totalReferences={this.state.totalReferences}
                      orphanedCitations={this.state.orphanedCitations}
                      orphanedReferences={this.state.orphanedReferences}
                    />
                )
            }
          </HeroList>
        </div>
        <footer>
          <p>
            Icons made by <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
          </p>
        </footer>
      </>
    );
  }
}
