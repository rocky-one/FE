import React from 'react'
import {
    of
} from 'rxjs'
import {mIns} from './index'
export default function storeHOC(WrappedComponent, mapStateToProps) { //storeProps = {}, props = {}
    return class StoreHOC extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                storeProps: mapStateToProps(mIns.getStoreRoot(), this.props),
            }
        }
        componentDidMount() {
            const storeProps = mapStateToProps(mIns.getStoreRoot(), this.props)

            this.observable = of(storeProps).subscribe(sp => {
                this.setState({
                    storeProps: sp
                })
            })
        }
        componentWillUnmount() {
            this.observable.unsubscribe()
        }

        render() {
            console.log(this.props,34)
            return <WrappedComponent {...this.state.storeProps} {...this.props} />
        }
    }
    return <StoreHOC />
}