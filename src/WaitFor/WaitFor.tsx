export default function WaitFor(props) {
    if (props.when === true) {
        return props.children;
    } else {
        return 'Loading...';
    }
}