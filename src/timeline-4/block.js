/**
 * BLOCK: timeline-4
 *
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.editor;

import { blockProps, ContainerSave } from '../commonComponents/container/container';
import Edit from './edit';

/**
 * Provides the initial data for new block
 */
export const defaultItem = {
    title: __( 'New event', 'kenzap-timeline' ),
    time: 'March 2019',
};

export const defaultSubBlocks = JSON.stringify( [
    {
        title: __( 'Company Incorporated', 'kenzap-timeline' ),
        time: 'August 2018',
        key: new Date().getTime() + 1,
    },
    {
        title: __( 'Seed Investment', 'kenzap-timeline' ),
        time: 'September 2018',
        key: new Date().getTime() + 2,
    },
    {
        title: __( 'Prototype Released', 'kenzap-timeline' ),
        time: 'December 2018',
        key: new Date().getTime() + 3,
    },
    {
        title: __( 'Fully Functional Service Launch', 'kenzap-timeline' ),
        time: 'January 2019',
        key: new Date().getTime() + 4,
    },
    {
        title: __( 'Market Distribution', 'kenzap-timeline' ),
        time: 'April 2019',
        key: new Date().getTime() + 5,
    },
    {
        title: __( 'Alpha Channel Reached', 'kenzap-timeline' ),
        time: 'June 2019',
        key: new Date().getTime() + 6,
    },
    {
        title: __( 'Series A Investment', 'kenzap-timeline' ),
        time: 'July 2019',
        key: new Date().getTime() + 7,
    },
    {
        title: __( 'World Branding', 'kenzap-timeline' ),
        time: 'January 2020',
        key: new Date().getTime() + 8,
    },
] );

/**
 * Generate inline styles for custom settings of the block
 * @param {Object} attributes - of the block
 * @returns {Node} generated styles
 */
export const getStyles = attributes => {
    const kenzapContanerStyles = {
        maxWidth: `${ attributes.containerMaxWidth === '100%' ? '100%' : attributes.containerMaxWidth + 'px' }`,
        '--maxWidth': `${ attributes.containerMaxWidth === '100%' ? '100wh' : attributes.containerMaxWidth + ' ' } `,
    };

    const vars = {
        '--paddings': `${ attributes.containerPadding }`,
        '--paddingsMin': `${ attributes.containerPadding / 4 }`,
        '--paddingsMinPx': `${ attributes.containerPadding / 4 }px`,
        '--textColor': attributes.textColor,
        '--timeLineColor': attributes.timeLineColor,
        '--borderRadius': `${ attributes.borderRadius }px`,
        '--backgroundColor': attributes.backgroundColor,
    };

    let additionalClassForOwlContainer = 'kenzap-lg-carousel';
    if ( attributes.containerMaxWidth < 992 ) {
        additionalClassForOwlContainer = 'kenzap-md-carousel';
    }
    if ( attributes.containerMaxWidth < 768 ) {
        additionalClassForOwlContainer = 'kenzap-sm-carousel';
    }
    if ( attributes.containerMaxWidth < 480 ) {
        additionalClassForOwlContainer = 'kenzap-xs-carousel';
    }

    if ( attributes.width100 ) {
        additionalClassForOwlContainer = 'kenzap-lg-carousel';
    }

    return {
        vars,
        kenzapContanerStyles,
        additionalClassForOwlContainer,
    };
};

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kenzap/timeline-4', {
    title: __( 'Kenzap timeline 4', 'kenzap-timeline' ),
    icon: 'calendar-alt',
    category: 'layout',
    keywords: [
        __( 'timeline', 'kenzap-timeline' ),
    ],
    anchor: true,
    html: true,
    attributes: {
        ...blockProps,

        backgroundColor: {
            type: 'string',
            default: '#546eff',
        },

        titleSize: {
            type: 'number',
            default: 14,
        },

        timeSize: {
            type: 'number',
            default: 16,
        },

        textColor: {
            type: 'string',
            default: '#fff',
        },

        timeLineColor: {
            type: 'string',
            default: '#fff',
        },

        borderRadius: {
            type: 'number',
            default: 50,
        },

        withAnimation: {
            type: 'boolean',
            default: true,
        },

        items: {
            type: 'array',
            default: [],
        },

        activeRecord: {
            type: 'number',
            default: 5,
        },

        isFirstLoad: {
            type: 'boolean',
            default: true,
        },

        blockUniqId: {
            type: 'number',
            default: 0,
        },
    },

    edit: ( props ) => {
        if ( props.attributes.items.length === 0 && props.attributes.isFirstLoad ) {
            props.setAttributes( {
                items: [ ...JSON.parse( defaultSubBlocks ) ],
                isFirstLoad: false,
            } );
            // TODO It is very bad solution to avoid low speed working of setAttributes function
            props.attributes.items = JSON.parse( defaultSubBlocks );
            if ( ! props.attributes.blockUniqId ) {
                props.setAttributes( {
                    blockUniqId: new Date().getTime(),
                } );
            }
        }

        return ( <Edit { ...props } /> );
    },

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     * @param {Object} props - attributes
     * @returns {Node} rendered component
     */
    save: function( props ) {
        const {
            className,
            attributes,
        } = props;

        const { vars, kenzapContanerStyles, additionalClassForOwlContainer } = getStyles( props.attributes );

        return (
            <div className={ className ? className : '' } style={ vars }>
                <ContainerSave
                    className={ `kenzap-timeline-4 ${ attributes.withAnimation ? 'kp-animate' : '' } block-${ attributes.blockUniqId }` }
                    attributes={ attributes }
                    style={ vars }
                    withBackground
                    withPadding
                >
                    <div className="kenzap-container" style={ kenzapContanerStyles }>
                        <div className={ `timeline owl-carousel ${ additionalClassForOwlContainer }` }>
                            { attributes.items && attributes.items.map( ( item, index ) => (
                                <div
                                    key={ item.key }
                                    className={ `timeline-content ${ index + 1 === attributes.activeRecord ? 'current-time' : '' } ` }
                                >
                                    <div className="time-wrapper">
                                        <div className="time">
                                            <RichText.Content
                                                tagName="p"
                                                value={ item.time }
                                                style={ {
                                                    fontSize: `${ attributes.timeSize }px`,
                                                    lineHeight: `${ attributes.timeSize }px`,
                                                } }
                                            />
                                        </div>
                                    </div>
                                    <div className="info-wrapper">
                                        <div className="info">
                                            <RichText.Content
                                                tagName="h3"
                                                value={ item.title }
                                                style={ {
                                                    fontSize: `${ attributes.titleSize }px`,
                                                } }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) ) }
                        </div>
                    </div>
                </ContainerSave>
            </div>
        );
    },
} );
