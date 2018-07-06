import React from 'react'
import { connect } from 'react-redux'

const Score = ({amount}) => {
    <h1>{amount} points! Woo hoo!</h1>
}
const mapStateToProps = state => ({
    amount: state.score
})

export default connect(mapStateToProps)(Score)