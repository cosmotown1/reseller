# Verisign IDN registration

For a Verisign IDN registration, send the domain in Punycode and provide the
matching `idn_language` tag. The tag is required for Verisign IDNs and is not
inferred from the domain. It is not needed for ordinary ASCII registrations.

A Korean IDN request, for example, uses `idn_language: "KOR"`:

```json
{
  "domain": "xn--jj0b55g3tjca397l20aea895t.com",
  "idn_language": "KOR",
  "years": 1,
  "ns": ["ndns1.cosmotown.com", "ndns2.cosmotown.com"]
}
```

The supported tag list does not imply that every IDN label or language is
accepted by every registry. This extension applies only to Verisign
registrations.

| Language tag | Language |
|---|---|
| `AZE` | Azerbaijani |
| `BEL` | Belarusian |
| `BUL` | Bulgarian |
| `CHI` | Chinese |
| `GRE` | Greek |
| `JPN` | Japanese |
| `KOR` | Korean |
| `KUR` | Kurdish |
| `MAC` | Macedonian |
| `MOL` | Moldavian |
| `POL` | Polish |
| `RUS` | Russian |
| `UKR` | Ukrainian |

See the [registration API reference](../../README.md#domain-register) for the
request fields and response format.
