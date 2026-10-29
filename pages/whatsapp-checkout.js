import React, { useState } from 'react';
import { useCart } from '../src/shared/context/CartContext';
import Navbar from '../src/shared/components/Navbar';
import { ChevronDown, HelpCircle, CreditCard, Building2, Truck, MessageCircle, Loader2 } from 'lucide-react';

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// --- Sub-components for styling ---
const InputField = ({ id, label, optional = false, fullWidth = false, ...props }) => (
    <div className={fullWidth ? 'col-span-2' : ''}>
        <label htmlFor={id} className="sr-only">{label}</label>
        <input
            id={id}
            name={id}
            placeholder={label + (optional ? ' (opcional)' : '')}
            className="w-full px-4 py-3 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            {...props}
        />
    </div>
);

const SelectField = ({ id, label, options, fullWidth = false }) => (
    <div className={`relative ${fullWidth ? 'col-span-2' : ''}`}>
        <label htmlFor={id} className="sr-only">{label}</label>
        <select
            id={id}
            name={id}
            className="w-full appearance-none bg-white px-4 py-3 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
    </div>
);

const RadioSelect = ({ value, label, sublabel, selected, onChange, icon }) => (
    <div
        onClick={() => onChange && onChange(value)}
        className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer transition-all ${
            selected ? 'border-blue-600 ring-2 ring-blue-500 bg-blue-50/30' : 'border-stone-300 hover:border-stone-400'
        }`}
    >
        <div className="flex items-center">
            <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selected ? 'border-blue-600 bg-blue-600' : 'border-stone-400'
                }`}
            >
                {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <span className="ml-4 font-medium text-sm text-stone-900">{label}</span>
        </div>

        <div className="flex items-center gap-2">
            {icon}
            {sublabel && <span className="font-semibold text-sm text-stone-800">{sublabel}</span>}
        </div>
    </div>
);

// Order Summary
const OrderSummary = ({ cartItems, getCartTotal, shippingCost, total }) => (
    <div>
        <div className="space-y-6">
            {cartItems.length > 0 ? (
                cartItems.map((item) => (
                    <div key={item.variantId} className="flex items-center gap-5">

                        <div className="relative w-20 h-20 rounded-lg bg-stone-200 border border-stone-200 flex-shrink-0">
                            <img
                                src={item.image || 'https://via.placeholder.com/80'}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-md"
                            />
                            <span className="absolute -top-2 -right-2 flex items-center justify-center w-7 h-7 text-sm font-medium text-white bg-stone-600 rounded-full shadow">
                {item.quantity}
              </span>
                        </div>

                        <div className="flex-grow">
                            <h3 className="font-semibold text-base text-stone-900">{item.name}</h3>
                            <p className="text-sm sm:text-base text-stone-600">
                                {item.size} / {item.color}
                            </p>
                        </div>

                        <p className="font-semibold text-base text-stone-900 whitespace-nowrap">
                            {formatCurrency(item.price * item.quantity)}
                        </p>

                    </div>
                ))
            ) : (
                <p className="text-stone-600">No hay productos en el carrito.</p>
            )}
        </div>

        <div className="border-t border-stone-200 mt-8 pt-6 space-y-3 text-sm">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(getCartTotal())}</span>
            </div>

            <div className="flex justify-between">
                <span>Envío</span>
                <span className="font-medium">{formatCurrency(shippingCost)}</span>
            </div>
        </div>

        <div className="border-t border-stone-200 mt-6 pt-6">
            <div className="flex justify-between font-bold text-lg text-stone-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
            </div>
        </div>
    </div>
);

// Mobile accordion
const MobileOrderSummary = ({ cartItems, getCartTotal, shippingCost, total, isSubmitting }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="lg:hidden bg-stone-50 border-b border-stone-200">
            <div className="p-4">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center"
                >
                    <h2 className="text-lg font-medium flex items-center gap-2 text-black">
                         Resumen del pedido
                    </h2>

                    <div className="flex flex items-center gap-2">
                        <span className="font-bold text-lg text-stone-800">
                            {formatCurrency(total)}
                        </span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </button>
            </div>

            {isOpen && (
                <div className="p-4 border-t border-stone-200">
                    <OrderSummary
                        cartItems={cartItems}
                        getCartTotal={getCartTotal}
                        shippingCost={shippingCost}
                        total={total}
                    />
                </div>
            )}
            <div className="mt-4 p-4">
                <button
                    type="submit"
                    form="whatsapp-checkout-form"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg text-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <MessageCircle size={20} />}
                    {isSubmitting ? 'Registrando pedido...' : 'Enviar pedido por WhatsApp'}
                </button>
            </div>
        </div>
    );
};

export default function CheckoutWhatsapp() {
    const { cartItems, getCartTotal } = useCart();
    
    // States for selections
    const [paymentMethod, setPaymentMethod] = useState('transferencia');
    const [billingAddress, setBillingAddress] = useState('same');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fixed shipping cost
    const shippingCost = 18000;
    const shippingLabel = 'Envío Nacional Estándar';
    const total = getCartTotal() + shippingCost;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            setErrorMessage('El carrito está vacío.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const paymentLabels = {
            transferencia: 'Transferencia Bancaria',
            contraentrega: 'Pago Contra Entrega'
        };

        const spaceId = `web_order_${Date.now()}`;
        const workspaceId = 'mundo-movil';

        // Prepare simplified payload for ToolX Cloud POS spaces-quick endpoint
        const posPayload = {
            name: `Pedido Web - ${data.firstName || ''} ${data.lastName || ''}`.trim(),
            order: Date.now(),
            customer: {
                name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
                cellphone: data.phone || '',
                email: data.email || 'web@mundomovil.com'
            },
            delivery_info: {
                cellphone: data.phone || '',
                information: `${data.address || ''} ${data.apartment ? '(' + data.apartment + ')' : ''}, ${data.city || ''} (Cédula: ${data.cedula || 'N/A'})`
            },
            amounts: {
                [paymentMethod.toUpperCase()]: total
            },
            items: cartItems.map(item => ({
                materialId: item.variantId,
                quantity: item.quantity
            }))
        };

        try {
            // 1. Register order in POS backend
            const response = await fetch(`https://us-central1-toolx-cloud-pos.cloudfunctions.net/api/v1/workspaces/${workspaceId}/spaces-quick/${spaceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(posPayload),
            });

            if (!response.ok) {
                console.warn('POS sync warning:', response.statusText);
            }
        } catch (err) {
            console.error('Error syncing order to POS:', err);
            // We still proceed to WhatsApp even if POS sync has a network issue
        } finally {
            setIsSubmitting(false);
        }

        // 2. Construct WhatsApp message
        let message = `🛍️ *NUEVA ORDEN - MUNDO MÓVIL* 🛍️\n\n`;
        message += `🆔 *ID Pedido:* #${spaceId}\n`;
        message += `👤 *Datos del Cliente:*\n`;
        message += `• Nombre: ${data.firstName || ''} ${data.lastName || ''}\n`;
        if (data.cedula) message += `• Cédula: ${data.cedula}\n`;
        message += `• Teléfono: ${data.phone || ''}\n`;
        message += `• Email: ${data.email || ''}\n`;
        message += `• Dirección: ${data.address || ''} ${data.apartment ? '(' + data.apartment + ')' : ''}, ${data.city || ''}\n\n`;

        message += `🚚 *Método de Envío:*\n`;
        message += `• ${shippingLabel} (${formatCurrency(shippingCost)})\n\n`;

        message += `💳 *Método de Pago:*\n`;
        message += `• ${paymentLabels[paymentMethod] || paymentMethod}\n\n`;

        message += `🛒 *Productos:*\n`;
        cartItems.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n`;
            message += `   - Cantidad: ${item.quantity}\n`;
            message += `   - Color: ${item.color || 'N/A'} | Almacenamiento: ${item.size || 'N/A'}\n`;
            message += `   - Subtotal: ${formatCurrency(item.price * item.quantity)}\n\n`;
        });

        message += `📦 Envío: ${formatCurrency(shippingCost)}\n`;
        message += `💰 *TOTAL A PAGAR: ${formatCurrency(total)}*\n\n`;
        message += `_Quedo atento a la confirmación de mi pedido. ¡Gracias!_`;

        // WhatsApp number for Mundo Móvil
        const whatsappNumber = '573112369188'; // Replace with actual store number
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="bg-stone-50 min-h-screen font-sans">
            <Navbar />
            <main>
                <div className="lg:grid lg:grid-cols-2">

                    {/* FORMULARIO */}
                    <div className="py-12 px-4 sm:px-6 lg:border-r lg:pl-12 xl:pl-20 lg:pb-12">
                        <div className="max-w-2xl lg:w-full lg:ml-auto lg:mr-8">

                            <div className="mb-6 bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-center gap-3 text-emerald-800">
                                <MessageCircle size={24} className="text-emerald-600 flex-shrink-0" />
                                <p className="text-sm font-medium">
                                    ¡Estás a un paso! Completa tus datos y selecciona tu método de pago para registrar tu pedido y enviarlo por WhatsApp.
                                </p>
                            </div>

                            {errorMessage && (
                                <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 text-sm">
                                    {errorMessage}
                                </div>
                            )}

                            <form id="whatsapp-checkout-form" onSubmit={handleSubmit} className="space-y-8">

                                <section>
                                    <h2 className="text-xl font-semibold mb-4 text-stone-900">Contacto</h2>
                                    <InputField
                                        id="email"
                                        label="Email o número de teléfono móvil"
                                        fullWidth
                                        type="text"
                                        required
                                    />
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold mb-4 text-stone-900">Entrega</h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <SelectField
                                            id="country"
                                            label="País/Región"
                                            options={[{ value: 'co', label: 'Colombia' }]}
                                            fullWidth
                                        />

                                        <InputField id="firstName" label="Nombre" required />
                                        <InputField id="lastName" label="Apellidos" required />

                                        <InputField id="cedula" label="Cédula" fullWidth required />
                                        <InputField id="address" label="Dirección" fullWidth required />

                                        <InputField
                                            id="apartment"
                                            label="Casa, apartamento, etc."
                                            optional
                                            fullWidth
                                        />

                                        <InputField id="city" label="Ciudad" required />

                                        <SelectField
                                            id="state"
                                            label="Provincia / Estado"
                                            options={[{ value: 'meta', label: 'Meta' }]}
                                        />

                                        <InputField id="postalCode" label="Código postal" optional />

                                        <div className="col-span-2 relative">
                                            <InputField
                                                id="phone"
                                                label="Teléfono"
                                                type="tel"
                                                fullWidth
                                                required
                                            />
                                            <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold mb-4 text-stone-900">Método de envío</h2>
                                    <div className="space-y-3">
                                        <RadioSelect
                                            value="nacional"
                                            label={shippingLabel}
                                            sublabel={formatCurrency(shippingCost)}
                                            selected={true}
                                            icon={<Truck size={20} className="text-stone-600" />}
                                        />
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold mb-4 text-stone-900">Pago</h2>
                                    <p className="text-sm text-stone-500 mb-4">
                                        Selecciona cómo deseas realizar el pago de tu pedido.
                                    </p>

                                    <div className="space-y-3">
                                        <RadioSelect
                                            value="transferencia"
                                            label="Transferencia Bancaria (Bancolombia / Nequi / Daviplata)"
                                            selected={paymentMethod === 'transferencia'}
                                            onChange={setPaymentMethod}
                                            icon={<Building2 size={20} className="text-blue-600" />}
                                        />
                                        <RadioSelect
                                            value="contraentrega"
                                            label="Pago Contra Entrega (Pagas al recibir)"
                                            selected={paymentMethod === 'contraentrega'}
                                            onChange={setPaymentMethod}
                                            icon={<CreditCard size={20} className="text-emerald-600" />}
                                        />
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold mb-4 text-stone-900">
                                        Dirección de facturación
                                    </h2>

                                    <div className="space-y-3">
                                        <RadioSelect
                                            value="same"
                                            label="La misma dirección de envío"
                                            selected={billingAddress === 'same'}
                                            onChange={setBillingAddress}
                                        />

                                        <RadioSelect
                                            value="different"
                                            label="Usar una dirección de facturación distinta"
                                            selected={billingAddress === 'different'}
                                            onChange={setBillingAddress}
                                        />
                                    </div>

                                    {billingAddress === 'different' && (
                                        <div className="mt-6 pt-6 border-t border-stone-200">
                                            <div className="grid grid-cols-2 gap-4">
                                                <SelectField
                                                    id="billing_country"
                                                    label="País/Región"
                                                    options={[{ value: 'co', label: 'Colombia' }]}
                                                    fullWidth
                                                />
                                                <InputField id="billing_firstName" label="Nombre" />
                                                <InputField id="billing_lastName" label="Apellidos" />
                                                <InputField
                                                    id="billing_company"
                                                    label="Empresa"
                                                    optional
                                                    fullWidth
                                                />
                                                <InputField id="billing_address" label="Dirección" fullWidth />
                                                <InputField
                                                    id="billing_apartment"
                                                    label="Casa, apartamento, etc."
                                                    optional
                                                    fullWidth
                                                />
                                                <InputField id="billing_city" label="Ciudad" />
                                                <SelectField
                                                    id="billing_state"
                                                    label="Provincia / Estado"
                                                    options={[{ value: 'meta', label: 'Meta' }]}
                                                />
                                                <InputField id="billing_postalCode" label="Código postal" optional />
                                                <div className="col-span-2 relative">
                                                    <InputField
                                                        id="billing_phone"
                                                        label="Teléfono"
                                                        type="tel"
                                                        optional
                                                        fullWidth
                                                    />
                                                    <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || cartItems.length === 0}
                                    className="hidden lg:flex w-full bg-emerald-600 text-white font-semibold py-4 px-6 rounded-lg text-lg hover:bg-emerald-700 transition-colors items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <MessageCircle size={24} />}
                                    {isSubmitting ? 'Registrando pedido...' : 'Enviar pedido por WhatsApp'}
                                </button>

                                <MobileOrderSummary
                                    cartItems={cartItems}
                                    getCartTotal={getCartTotal}
                                    shippingCost={shippingCost}
                                    total={total}
                                    isSubmitting={isSubmitting}
                                />

                            </form>
                        </div>
                    </div>

                    {/* RESUMEN DEL PEDIDO */}
                    <div className="hidden lg:block bg-stone-100">
                        <div className="py-12 px-4 sm:px-6 lg:pr-12 xl:pr-20 sticky top-0 h-screen overflow-y-auto">
                            <div className="max-w-2xl lg:w-full lg:ml-0 lg:mr-auto">
                                <h2 className="text-xl font-semibold mb-6 text-stone-900">
                                    Resumen del pedido
                                </h2>

                                <OrderSummary
                                    cartItems={cartItems}
                                    getCartTotal={getCartTotal}
                                    shippingCost={shippingCost}
                                    total={total}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
