const prisma = require('../lib/prisma');

// ── Helpers ────────────────────────────────────────────────────────────────

function ok(res, data, message = 'Success', status = 200) {
  return res.status(status).json({ success: true, data, message });
}

function fail(res, message, status = 400) {
  return res.status(status).json({ success: false, data: null, message });
}

// ── GET /api/forex-accounts ────────────────────────────────────────────────
// Returns all forex accounts ordered by createdAt descending

async function getAll(req, res) {
  try {
    const accounts = await prisma.forexAccount.findMany({
      orderBy: { createdAt: 'desc' },
      include: { assignedAgent: { select: { id: true, name: true, role: true } } },
    });
    return ok(res, accounts);
  } catch (err) {
    console.error('getAll ForexAccount error:', err);
    return fail(res, 'Database error, please try again', 500);
  }
}

// ── POST /api/forex-accounts ───────────────────────────────────────────────
// Required: id, clientName, email
// Optional: phone, country, balance, currencyPair, status, kycStatus,
//           kycDocType, kycExpiry, statementStatus, statementSubmittedAt,
//           repeatOf, repeatReason, assignedAgentId, joinedAt

async function create(req, res) {
  const {
    id, clientName, email,
    phone, country, balance, currencyPair,
    status, kycStatus, kycDocType, kycExpiry,
    statementStatus, statementSubmittedAt,
    repeatOf, repeatReason,
    assignedAgentId, joinedAt,
  } = req.body;

  // Required field validation
  if (!id)          return fail(res, 'Field id is required');
  if (!clientName)  return fail(res, 'Field clientName is required');
  if (!email)       return fail(res, 'Field email is required');

  try {
    const account = await prisma.forexAccount.create({
      data: {
        id,
        clientName,
        email,
        phone:                phone       ?? null,
        country:              country     ?? null,
        balance:              balance     !== undefined ? parseFloat(balance) : 0,
        currencyPair:         currencyPair ?? null,
        status:               status      ?? 'active',
        kycStatus:            kycStatus   ?? 'valid',
        kycDocType:           kycDocType  ?? null,
        kycExpiry:            kycExpiry   ? new Date(kycExpiry) : null,
        statementStatus:      statementStatus      ?? null,
        statementSubmittedAt: statementSubmittedAt ? new Date(statementSubmittedAt) : null,
        repeatOf:             repeatOf    ?? null,
        repeatReason:         repeatReason ?? null,
        assignedAgentId:      assignedAgentId ? parseInt(assignedAgentId) : null,
        joinedAt:             joinedAt    ? new Date(joinedAt) : new Date(),
      },
    });
    return ok(res, account, 'Account created successfully', 201);
  } catch (err) {
    // Unique constraint violation (duplicate id or email)
    if (err.code === 'P2002') {
      const field = err.meta?.target?.includes('email') ? 'email' : 'id';
      return fail(res, `An account with this ${field} already exists`, 409);
    }
    console.error('create ForexAccount error:', err);
    return fail(res, 'Database error, please try again', 500);
  }
}

// ── PUT /api/forex-accounts/:id ────────────────────────────────────────────
// Updates an existing account — returns 404 if id not found

async function update(req, res) {
  const { id } = req.params;
  const {
    clientName, email, phone, country, balance, currencyPair,
    status, kycStatus, kycDocType, kycExpiry,
    statementStatus, statementSubmittedAt,
    repeatOf, repeatReason, assignedAgentId, joinedAt,
  } = req.body;

  // Build only the fields that were actually sent
  const data = {};
  if (clientName          !== undefined) data.clientName          = clientName;
  if (email               !== undefined) data.email               = email;
  if (phone               !== undefined) data.phone               = phone;
  if (country             !== undefined) data.country             = country;
  if (balance             !== undefined) data.balance             = parseFloat(balance);
  if (currencyPair        !== undefined) data.currencyPair        = currencyPair;
  if (status              !== undefined) data.status              = status;
  if (kycStatus           !== undefined) data.kycStatus           = kycStatus;
  if (kycDocType          !== undefined) data.kycDocType          = kycDocType;
  if (kycExpiry           !== undefined) data.kycExpiry           = kycExpiry ? new Date(kycExpiry) : null;
  if (statementStatus     !== undefined) data.statementStatus     = statementStatus;
  if (statementSubmittedAt !== undefined) data.statementSubmittedAt = statementSubmittedAt ? new Date(statementSubmittedAt) : null;
  if (repeatOf            !== undefined) data.repeatOf            = repeatOf;
  if (repeatReason        !== undefined) data.repeatReason        = repeatReason;
  if (assignedAgentId     !== undefined) data.assignedAgentId     = assignedAgentId ? parseInt(assignedAgentId) : null;
  if (joinedAt            !== undefined) data.joinedAt            = joinedAt ? new Date(joinedAt) : null;

  if (Object.keys(data).length === 0) {
    return fail(res, 'No fields provided to update');
  }

  try {
    const account = await prisma.forexAccount.update({
      where: { id },
      data,
    });
    return ok(res, account, 'Account updated successfully');
  } catch (err) {
    if (err.code === 'P2025') return fail(res, 'Record not found', 404);
    if (err.code === 'P2002') return fail(res, 'An account with this email already exists', 409);
    console.error('update ForexAccount error:', err);
    return fail(res, 'Database error, please try again', 500);
  }
}

// ── DELETE /api/forex-accounts/:id ────────────────────────────────────────
// Deletes an account — returns 404 if id not found

async function remove(req, res) {
  const { id } = req.params;

  try {
    await prisma.forexAccount.delete({ where: { id } });
    return ok(res, null, 'Account deleted successfully');
  } catch (err) {
    if (err.code === 'P2025') return fail(res, 'Record not found', 404);
    console.error('delete ForexAccount error:', err);
    return fail(res, 'Database error, please try again', 500);
  }
}

module.exports = { getAll, create, update, remove };
