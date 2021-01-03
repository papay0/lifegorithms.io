import { Link, graphql } from 'gatsby';
import {
  formatPostDate,
  formatReadingTime,
  formatCategory,
} from '../utils/helpers';

import Bio from '../components/Bio';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import Panel from '../components/Panel';
import React from 'react';
import SEO from '../components/SEO';
import get from 'lodash/get';
import { rhythm } from '../utils/typography';
import Header from '../components/Header';

class BlogIndexTemplate extends React.Component {
  state = { selectedCategories: [] };

  updateSelectedCategories = categories => {
    this.setState({ selectedCategories: categories });
  };

  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const langKey = this.props.pageContext.langKey;
    const selectedCategories = this.state.selectedCategories;
    const posts = get(this, 'props.data.allMarkdownRemark.edges').filter(
      post => {
        const category = post.node.frontmatter.category;
        if (selectedCategories.length === 0) {
          return true;
        } else if (selectedCategories.includes(category)) {
          return true;
        } else {
          return false;
        }
      }
    );

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO />
        <aside>
          <Bio showAboutMe={true} />
          <Header updateSelectedCategories={this.updateSelectedCategories} />
        </aside>
        <main>
          {posts
            .filter(({ node }) => {
              return node.frontmatter.published;
            })
            .map(({ node }) => {
              const title = get(node, 'frontmatter.title') || node.fields.slug;
              return (
                <article key={node.fields.slug}>
                  <header>
                    <h3
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: rhythm(1),
                        marginBottom: rhythm(1 / 4),
                      }}
                    >
                      <Link
                        style={{ boxShadow: 'none' }}
                        to={node.fields.slug}
                        rel="bookmark"
                      >
                        {title}
                      </Link>
                    </h3>
                    <small>
                      {formatPostDate(node.frontmatter.date, langKey)}
                      {` • ${formatReadingTime(node.timeToRead)}`}
                      {` • ${formatCategory(node.frontmatter.category)}`}
                    </small>
                  </header>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: node.frontmatter.spoiler,
                    }}
                  />
                </article>
              );
            })}
        </main>
        <Footer />
      </Layout>
    );
  }
}

export default BlogIndexTemplate;

export const pageQuery = graphql`
  query($langKey: String!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      filter: { fields: { langKey: { eq: $langKey } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          fields {
            slug
            langKey
          }
          timeToRead
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            spoiler
            category
            published
          }
        }
      }
    }
  }
`;
