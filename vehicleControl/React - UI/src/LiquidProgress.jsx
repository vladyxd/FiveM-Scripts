import './LiquidProgress.css';
const LiquidProgressBar = ({value}) => {
    return (
        <div className="progress">
            <div className="progress-value" style={{height: value + '%'}}></div>
        </div>
    );
};


export default LiquidProgressBar;