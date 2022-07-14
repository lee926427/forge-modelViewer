function DeviceDetail({ header, main, footer, title, className }) {
    return (
        <div className={className}>
            <header>
                {title ? title : null}
                {header ? header() : null}
            </header>
            <main>{main ? main() : null}</main>
            <footer>{footer ? footer() : null}</footer>
        </div>
    );
}

export default DeviceDetail;
