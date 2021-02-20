import { Layout } from ".";

export default class UnknownComponent extends React.Component {
  render() {
    if (this.props.useLayout) {
      return (
        <Layout {...this.props}>
          <div>
            <h2>UNKNOWN COMPONENT</h2>
            {this.props.children}
          </div>
        </Layout>
      );
    }

    return (
      <div>
        <h2>UNKNOWN COMPONENT</h2>
        {this.props.children}
      </div>
    );
  }
}