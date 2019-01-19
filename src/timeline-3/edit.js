const { __ } = wp.i18n; // Import __() from wp.i18n
const { Component } = wp.element;
const { RichText, InspectorControls, PanelColorSettings } = wp.editor;
const { RangeControl, PanelBody } = wp.components;

import { defaultItem, getStyles } from './block';

import { InspectorContainer, ContainerEdit } from '../commonComponents/container/container';
import { Plus } from '../commonComponents/icons/plus';

/**
 * Keys for new blocks
 * @type {number}
 */
let key = 0;

/**
 * The edit function describes the structure of your block in the context of the editor.
 * This represents what the editor will render when the block is used.
 *
 * The "edit" property must be a valid function.
 * @param {Object} props - attributes
 * @returns {Node} rendered component
 */
export default class Edit extends Component {
    state = {
        activeSubBlock: -1,
    };

    /**
     * Add a new item to list with default fields
     */
    addItem = () => {
        key++;
        this.props.setAttributes( {
            items: [ ...this.props.attributes.items, {
                ...defaultItem,
                title: defaultItem.title + ' ' + ( key ),
                key: 'new ' + new Date().getTime(),
            } ],
        } );
        setTimeout( () => {
            const element = document.querySelector( '.kenzap-timeline-3 .owl-stage' );
            element.scrollLeft = element.scrollWidth;
        } );
    };

    /**
     * Change any property of item
     * @param {string} property - editable field
     * @param {string} value - for field
     * @param {number} index - of items array
     * @param {boolean} withMutation - in some cases we should avoid mutation for force rerender component
     */
    onChangePropertyItem = ( property, value, index, withMutation = false ) => {
        const items = withMutation ? [ ...this.props.attributes.items ] : this.props.attributes.items;
        if ( ! items[ index ] || typeof items[ index ][ property ] !== 'string' ) {
            return;
        }
        items[ index ][ property ] = value;
        this.props.setAttributes( { items: items } );
    };

    /**
     * Remove item
     * It also add default item if we remove all elements from array
     * @param {number} index - of item
     */
    removeItem = ( index ) => {
        const items = [ ...this.props.attributes.items ];
        if ( items.length === 1 ) {
            this.props.setAttributes( { items: [ defaultItem ] } );
        } else {
            items.splice( index, 1 );
            this.props.setAttributes( { items: items } );
        }
    };

    render() {
        const {
            className,
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        const { vars, kenzapContanerStyles, additionalClassForOwlContainer } = getStyles( attributes );

        return (
            <div>
                <InspectorControls>
                    <PanelBody
                        title={ __( 'General', 'kenzap-timeline' ) }
                        initialOpen={ false }
                    >
                        <RangeControl
                            label={ __( 'Title size', 'kenzap-timeline' ) }
                            value={ attributes.titleSize }
                            onChange={ ( titleSize ) => setAttributes( { titleSize } ) }
                            min={ 10 }
                            max={ 130 }
                        />
                        <RangeControl
                            label={ __( 'Description size', 'kenzap-timeline' ) }
                            value={ attributes.descriptionSize }
                            onChange={ ( descriptionSize ) => setAttributes( { descriptionSize } ) }
                            min={ 10 }
                            max={ 130 }
                        />
                        <RangeControl
                            label={ __( 'Time size', 'kenzap-timeline' ) }
                            value={ attributes.timeSize }
                            onChange={ ( timeSize ) => setAttributes( { timeSize } ) }
                            min={ 10 }
                            max={ 130 }
                        />
                        <PanelColorSettings
                            title={ __( 'Colors', 'kenzap-timeline' ) }
                            initialOpen={ false }
                            colorSettings={ [
                                {
                                    value: attributes.textColor,
                                    onChange: ( value ) => {
                                        return setAttributes( { textColor: value } );
                                    },
                                    label: __( 'Text color', 'kenzap-timeline' ),
                                },
                                {
                                    value: attributes.timeLineColor,
                                    onChange: ( timeLineColor ) => {
                                        return setAttributes( { timeLineColor } );
                                    },
                                    label: __( 'Element and circle color', 'kenzap-timeline' ),
                                },
                                {
                                    value: attributes.boxBackground,
                                    onChange: ( boxBackground ) => {
                                        return setAttributes( { boxBackground } );
                                    },
                                    label: __( 'Box background', 'kenzap-timeline' ),
                                },
                            ] }
                        />
                        <RangeControl
                            label={ __( 'Featured', 'kenzap-timeline' ) }
                            value={ attributes.highlightedRecords }
                            onChange={ ( highlightedRecords ) => setAttributes( { highlightedRecords } ) }
                            min={ 0 }
                            max={ attributes.items.length }
                            help={ __( 'Mark how many records are highlighted as featured from the beginning of the timeline.', 'kenzap-timeline' ) }
                        />
                    </PanelBody>
                    <InspectorContainer
                        setAttributes={ setAttributes }
                        { ...attributes }
                        withPadding
                        withWidth100
                        withBackground
                        withAutoPadding
                    />
                </InspectorControls>
                <div className={ className ? className : '' } style={ vars }>
                    <ContainerEdit
                        className={ `kenzap-timeline-3 block-${ attributes.blockUniqId } ${ isSelected ? 'selected' : '' } ` }
                        attributes={ attributes }
                        withBackground
                        withPadding
                    >
                        <div className="kenzap-container" style={ kenzapContanerStyles }>
                            <div className={ `timeline owl-carousel owl-loaded ${ additionalClassForOwlContainer }` }>
                                <div className="owl-stage-outer">
                                    <div className="owl-stage">
                                        { attributes.items && attributes.items.map( ( item, index ) => (
                                            <div className="owl-item" key={ item.key }>
                                                <div
                                                    key={ item.key }
                                                    className={ `timeline-content ${ attributes.highlightedRecords > index ? 'past-time' : '' } ${ attributes.highlightedRecords == index+1 ? 'past-time-last' : '' }` }
                                                >
                                                    <button className="remove" onClick={ () => this.removeItem( index ) }>
                                                        <span className="dashicons dashicons-no" />
                                                    </button>

                                                    <div className="time-wrapper">
                                                        <div className="time" style={ { color: attributes.textColor } }>
                                                            <RichText
                                                                tagName="p"
                                                                placeholder={ __( 'Date', 'kenzap-timeline' ) }
                                                                value={ item.time }
                                                                onChange={ ( value ) => this.onChangePropertyItem( 'time', value, index, true ) }
                                                                style={ {
                                                                    color: attributes.textColor,
                                                                    fontSize: `${ attributes.timeSize }px`,
                                                                    lineHeight: `${ attributes.timeSize }px`,
                                                                } }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="info-wrapper">
                                                        <div className="info">
                                                            <RichText
                                                                tagName="h3"
                                                                placeholder={ __( 'Title', 'kenzap-timeline' ) }
                                                                value={ item.title }
                                                                onChange={ ( value ) => this.onChangePropertyItem( 'title', value, index, true ) }
                                                                style={ {
                                                                    color: attributes.textColor,
                                                                    fontSize: `${ attributes.titleSize }px`,
                                                                    lineHeight: `${ attributes.titleSize }px`,
                                                                } }
                                                            />
                                                            <RichText
                                                                tagName="p"
                                                                placeholder={ __( 'Description', 'kenzap-timeline' ) }
                                                                value={ item.description }
                                                                onChange={ ( value ) => this.onChangePropertyItem( 'description', value, index, true ) }
                                                                style={ {
                                                                    color: attributes.textColor,
                                                                    fontSize: `${ attributes.descriptionSize }px`,
                                                                    lineHeight: `${ attributes.descriptionSize * 1.8 }px`,
                                                                } }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) ) }
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="editPadding" />
                        <button
                            className="addWhite"
                            onClick={ this.addItem }>
                            <span><Plus /></span>{ __( 'Add new event', 'kenzap-timeline' ) }
                        </button>
                    </ContainerEdit>
                </div>
            </div>
        );
    }
}
