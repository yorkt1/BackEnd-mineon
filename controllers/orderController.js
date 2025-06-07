import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createOrder = async (req, res) => {
  const { userId, addressId, total, items } = req.body; // items é um array de { productId, quantity, unitPrice }
  try {
    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        addressId: parseInt(addressId),
        total: parseFloat(total),
        status: 'pendente',
        orderItems: {
          createMany: {
            data: items.map(item => ({
              productId: parseInt(item.productId),
              quantity: parseInt(item.quantity),
              unitPrice: parseFloat(item.unitPrice),
            })),
          },
        },
      },
      include: {
        orderItems: true,
      },
    });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar pedido.' });
  }
};

const getOrders = async (req, res) => {
  const userId = req.user.isAdmin ? undefined : req.user.id; // Admins veem todos, usuários veem os seus
  try {
    const orders = await prisma.order.findMany({
      where: userId ? { userId: parseInt(userId) } : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar pedidos.' });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.isAdmin ? undefined : req.user.id;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(id),
        ...(userId && { userId: parseInt(userId) }), // Só adiciona userId se não for admin d
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado ou você não tem permissão para acessá-lo.' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar pedido.' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar status do pedido.' });
  }
};

export { createOrder, getOrders, getOrderById, updateOrderStatus };
