'use client';
import {Collapse} from 'antd';
import Block from '@components/Block/Block';
import classes from './Faq.module.scss';

interface Props {
    title: string
}

export default function Faq({title}: Props) {
    const items = [
        {
            label: 'How to Create Account for Multiple Branches?',
            children: 'Please direct message to us if you have multiple branches. We will set up an account with your branches included.',
        },
        {
            label: 'How to Change Account Information?',
            children: 'After logging in to the ARDO platform, you can change your restaurant name, contact information and delivery address, etc. any time on the menu bar.',
        },
        {
            label: 'How to Order? What is the Ordering Process?',
            children: (
                <>
                    <p>{'Simply follow the steps below and you can easily place an order at ARDO:'}</p>
                    <p><span>{'1. '}</span><a href={"https://app.ardogroup.org"} target={"_blank"}>{'Shop'}</a><span>{' for ingredients and add to "Shopping Cart"'}</span></p>
                    <p>{'2. Click on "Shopping Cart" at the top menu bar, select your branch, delivery date and the products you which to purchase, then click "Confirm"; The order status will be changed to "Processing".'}</p>
                    <p>{'3. Review your purchase order once we change the order status to “Confirmed”. Please note that your order will be shipped by supplier once its confirmed. You will have to inform us within 12 hours if there’s any problem with items, catch weight etc;'}</p>
                    <p>{'4. We will send you the invoice on or before the day of shipment, please settle by direct transfer, FPS or other payment method we opened in the future.'}</p>
                    <p>{'Please contact us if you encounter any problems during the order process, our team will follow-up with you as soon as possible.'}</p>
                </>
            )
        },
        {
            label: 'What if I Ordered Catch Weight Goods?',
            children: (
                <>
                    <p>{'We understand that certain ingredients may not be able to maintain a fixed weight. To save time, our partnered food suppliers will confirm the actual weight of these items when they receive your purchase order. We will modify your purchase order based on the actual weight and price of the ingredients.'}</p>
                    <p>{'You can view the weight and invoice amount of these items after the order status changed to "Confirmed"'}</p>
                </>
            )
        },
        {
            label: 'What are Favourites?',
            children: 'If you want to follow certain ingredients but do not want to place order immediately, you can add these to “ Favourites”. When browsing, click heart shaped button to move the ingredients to “ Favourites”, then you can easily stay up to date on information and price of ingredients for future orders.'
        },
        {
            label: 'How to Do Modify / Cancel Order ?',
            children: (
                <>
                    <p>{'You cannot modify or cancel your purchase order after it is "Processing". Please direct message us if you encounter any problems.'}</p>
                    <p>{'However, once your purchase order has been changed to "confirmed", we will no longer be able to modify or cancel the purchase order for you.'}</p>
                </>
            )
        },
        {
            label: 'How to View and Manage Orders?',
            children: 'You can view and manage your on the menu bar. Each order record is equivalent to an electronic invoice / receipt and include order date, order number, branch information, supplier information, item details, order amount, delivery schedule and payment details.'
        },
        {
            label: 'How to Download My Electronic Invoice / Receipt?',
            children: 'Once the purchase order is confirmed by the food supplier, you can go to "Order Management" to view and download the relevant electronic invoice / receipt.'
        },
        {
            label: 'How to Track My Orders?',
            children: (
                <>
                    <p>{'Currently, all purchase orders made on platform are delivered by the food suppliers. You can check the order status and delivery schedule with us through direct message'}</p>
                    <p>{'In order to avoid unnecessary trouble, we recommend paying attention to the delivery arrangements before placing an order.'}</p>
                    <p>{'Please contact us if you have any questions about the status of your order, our team will follow-up with you as soon as possible.'}</p>
                </>
            )
        },
        {
            label: 'Goods Receipt Procedure',
            children: (
                <>
                    <p>{'In general, the purchase orders need to be confirmed and signed by both restaurants and food suppliers on delivery. The food suppliers will contact you on the day of delivery, all you need to do is arrange staff to confirm and sign for the ingredients on receipt.'}</p>
                    <p>{'To avoid unnecessary disputes, we strongly recommend you to always check and sign for your purchase order on receipt.'}</p>
                </>
            )
        },
        {
            label: 'What if I Received Wrong Items / Missing Items / Damaged Items When Delivered?',
            children: (
                <>
                    <p>{'We are sorry that you experienced unnecessary trouble during your order. If there are any problems upon receipt, please contact us with your order number and a brief description of the problem, our team will follow-up with you as soon as possible.'}</p>
                    <p>{'Once the problems are confirmed, we will, at your request:'}</p>
                    <p>{'1. Immediately arrange with the food supplier to re-deliver and return the faulty ingredients on the next working day; or'}</p>
                    <p>{'2. Arrange with the food supplier for the return and refund of the relevant ingredients.'}</p>
                </>
            )
        },
        {
            label: 'What are the Payment Options?',
            children: (
                <>
                    <p>{'Currently, orders placed on the platform can be paid in the following ways:'}</p>
                    <p>{'- Direct Transfer / FPS'}</p>
                    <p>{'- Credit Card - available soon'}</p>
                    <p>{'In order to improve your ordering experience, we are working on solutions to provide more payment methods, and hope to provide updates in the near future.'}</p>
                </>
            )
        },
        {
            label: 'Buyer Protection',
            children: (
                <>
                    <p>{'We are sorry that you experienced unnecessary trouble during your order. If there are any problems upon receipt, please open a case with our food supplier partner to resolve the issue.'}</p>
                    <p>{'Most issues can be settled by directly contacting with our food supplier partner.'}</p>
                    <p>{'Once the problems are confirmed, our food supplier partners will, at your request:'}</p>
                    <p>{'1. Immediately arrange to re-deliver and return the faulty ingredients on the next working day; or'}</p>
                    <p>{'2. Arrange for the return and refund of the relevant ingredients.'}</p>
                    <p>{'If your case cannot be settled with our food supplier partner, please contact us directly, our team will follow-up with you as soon as possible.'}</p>
                </>
            )
        },
        {
            label: 'Seller Protection',
            children: 'If you are subject to abusive behaviour or receive complaints due to reasons outside your control (e.g. weather or out of stock), we will take action and resolve the issue. Please contact us directly, our team will follow-up with you as soon as possible.'
        },
    ]

    return (
        <Block title={title}>
            <div id={'faq'} className={classes.faq}>
                <Collapse
                    items={items.map((item, index) => ({
                        key: index,
                        label: (
                            <span className={classes.faq__item__title}>{`${index + 1}. ${item.label}`}</span>
                        ),
                        children: (
                            <p>{item.children}</p>
                        ),
                    }))}
                    size={"large"}
                />
            </div>
        </Block>
    )
}
