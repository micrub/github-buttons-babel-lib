
import Base from './Base';
import Renderer from './Renderer';
import GitHubButton from './React/Component/GitHubButton';

//TODO seems wrong
//window.GitHubButton = GitHubButton || null;

const base = new Base();

export default { GitHubButton, render: Renderer.render }


