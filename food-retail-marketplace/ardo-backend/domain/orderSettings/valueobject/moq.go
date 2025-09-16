package valueobject

type Moq struct {
	fee      int64
	freeFrom int64
}

func NewMoq(fee, freeFrom int64) Moq {
	if fee < 0 {
		fee = 0
	}
	if freeFrom < 0 {
		freeFrom = 0
	}
	return Moq{fee: fee, freeFrom: freeFrom}
}

func (m *Moq) GetFee() int64 {
	return m.fee
}

func (m *Moq) GetFreeFrom() int64 {
	return m.freeFrom
}

func (m *Moq) UpdateFee(fee int64) {
	m.fee = fee
}

func (m *Moq) UpdateFreeFrom(freeFrom int64) {
	m.freeFrom = freeFrom
}

func UnmarshalMoqFromDatabase(fee, freeFrom int64) Moq {
	return Moq{fee: fee, freeFrom: freeFrom}
}
